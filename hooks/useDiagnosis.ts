"use client";

/**
 * AI仕事診断｜診断フローの状態管理
 *
 * 出典:
 *   docs/01_diagnosis-spec.md §15, §18-21, §51-52, §69-70
 *   docs/08_web-spec.md §8, §47, §94-96
 *
 * 状態遷移:
 *   intro → question → calculating → result
 *
 * 方針:
 *   - 採点は lib/scoring.ts に任せ、このフックは画面の進行だけを扱う
 *   - 状態は1つのオブジェクトにまとめる。復元や画面遷移を「1回の更新」で
 *     済ませられるようにし、途中状態が描画されるのを防ぐため
 *   - localStorage の読み込みはマウント後に行う（SSRとの不一致を避けるため）
 *   - 自動遷移は「ユーザーが回答カードをタップしたとき」だけ発生させる。
 *     戻って既存の回答が表示されている状態では発生させない
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { questions } from "@/data/questions";
import {
  ANSWER_ADVANCE_DELAY_MS,
  CALCULATING_TOTAL_MS,
} from "@/lib/constants";
import {
  clearDiagnosis,
  loadProgress,
  loadResult,
  saveProgress,
  saveResult,
} from "@/lib/diagnosisStorage";
import { scoreDiagnosis } from "@/lib/scoring";
import type {
  AnswerMap,
  DiagnosisResult,
  DiagnosisScreen,
  OptionId,
  Question,
  QuestionId,
  ScoringErrorReason,
} from "@/types/diagnosis";

/** 質問の総数 */
export const TOTAL_QUESTIONS = questions.length;

/** 診断フロー全体の状態 */
type DiagnosisState = {
  readonly screen: DiagnosisScreen;
  /** localStorage からの復元が終わったか */
  readonly isRestored: boolean;
  /** 現在の質問の位置（0始まり） */
  readonly currentIndex: number;
  readonly answers: AnswerMap;
  readonly startedAt: string | null;
  readonly result: DiagnosisResult | null;
  readonly error: ScoringErrorReason | null;
};

const INITIAL_STATE: DiagnosisState = {
  screen: "intro",
  isRestored: false,
  currentIndex: 0,
  answers: {},
  startedAt: null,
  result: null,
  error: null,
};

/**
 * 保存済みデータから復元後の状態を組み立てる。
 *
 * localStorage を読むだけの純粋な処理としてフックの外に置き、
 * React の状態更新と切り離す。
 */
function buildRestoredState(): DiagnosisState {
  // 保存済みの結果があれば結果画面から再開する
  // （公式LINEへ移動して戻ってきた場合を想定：01 §47）
  const savedResult = loadResult();
  if (savedResult !== null) {
    return {
      ...INITIAL_STATE,
      isRestored: true,
      screen: "result",
      result: savedResult,
    };
  }

  // 診断途中なら、その質問から再開する（01 §19）
  const savedProgress = loadProgress();
  if (savedProgress !== null && Object.keys(savedProgress.answers).length > 0) {
    const restoredIndex = Math.min(
      Math.max(savedProgress.currentQuestion - 1, 0),
      TOTAL_QUESTIONS - 1,
    );
    return {
      ...INITIAL_STATE,
      isRestored: true,
      screen: "question",
      currentIndex: restoredIndex,
      answers: savedProgress.answers,
      startedAt: savedProgress.startedAt,
    };
  }

  return { ...INITIAL_STATE, isRestored: true };
}

export type UseDiagnosis = {
  /** 現在の画面 */
  readonly screen: DiagnosisScreen;
  /** localStorage からの復元が終わったか。終わるまで画面を出さない */
  readonly isRestored: boolean;

  /** 現在の質問（screen が "question" のときのみ存在） */
  readonly currentQuestion: Question | undefined;
  /** 現在の質問番号（1始まり） */
  readonly currentNumber: number;
  /** 質問の総数 */
  readonly totalQuestions: number;
  /** 現在の質問に対する回答（未回答なら undefined） */
  readonly selectedOptionId: OptionId | undefined;
  /** 前の質問へ戻れるか */
  readonly canGoBack: boolean;

  /** 診断結果（screen が "result" のときのみ存在） */
  readonly result: DiagnosisResult | null;
  /** 採点に失敗した理由 */
  readonly error: ScoringErrorReason | null;

  /** 診断を開始する */
  readonly start: () => void;
  /** 回答する（ユーザーのタップ起点） */
  readonly answer: (questionId: QuestionId, optionId: OptionId) => void;
  /** 1つ前の質問へ戻る */
  readonly goBack: () => void;
  /** 最初からやり直す */
  readonly restart: () => void;
  /** 採点をやり直す（エラーからの復帰用） */
  readonly retryScoring: () => void;
};

export function useDiagnosis(): UseDiagnosis {
  const [state, setState] = useState<DiagnosisState>(INITIAL_STATE);

  /** 自動遷移・計算演出のタイマー。画面を離れるときに確実に止める */
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // --------------------------------------------------------------- 復元
  // localStorage はサーバー側に存在しないため、描画中には読めない。
  // マウント後に1度だけ読み込み、1回の更新で復元を完了させる。
  // eslint-disable-next-line react-hooks/set-state-in-effect -- 初回マウント時の1度きりの復元。連鎖描画は起きない
  useEffect(() => setState(buildRestoredState()), []);

  // アンマウント時にタイマーを止める
  useEffect(() => clearTimer, [clearTimer]);

  // --------------------------------------------------------------- 保存
  /** 回答と現在位置を保存する */
  const persistProgress = useCallback(
    (nextAnswers: AnswerMap, nextIndex: number, startedAtValue: string) => {
      saveProgress({
        currentQuestion: nextIndex + 1,
        answers: nextAnswers,
        startedAt: startedAtValue,
      });
    },
    [],
  );

  // --------------------------------------------------------------- 採点
  /**
   * 計算演出を挟んで結果画面へ進む。
   *
   * 採点自体は即座に終わるが、結果をすぐ出さず短い演出を入れる（01 §70）。
   */
  const goToCalculating = useCallback(
    (finalAnswers: AnswerMap) => {
      setState((prev) => ({ ...prev, screen: "calculating", error: null }));

      clearTimer();
      timerRef.current = setTimeout(() => {
        const outcome = scoreDiagnosis(finalAnswers);

        if (!outcome.ok) {
          // 採点に失敗したら結果へ進まず、質問画面へ戻して理由を伝える（08 §94）
          setState((prev) => ({
            ...prev,
            screen: "question",
            error: outcome.reason,
          }));
          return;
        }

        saveResult(outcome.result);
        setState((prev) => ({
          ...prev,
          screen: "result",
          result: outcome.result,
          error: null,
        }));
      }, CALCULATING_TOTAL_MS);
    },
    [clearTimer],
  );

  // --------------------------------------------------------------- 操作
  // 保存やタイマー設定などの副作用は、状態更新関数の中では行わない。
  // React が更新関数を複数回呼ぶ場合に二重実行されるため、
  // 必要な値を先に求めてから、副作用と状態更新をそれぞれ実行する。

  const start = useCallback(() => {
    clearTimer();

    const now = new Date().toISOString();
    persistProgress(state.answers, 0, now);

    setState((prev) => ({
      ...prev,
      screen: "question",
      currentIndex: 0,
      startedAt: now,
      error: null,
    }));
  }, [clearTimer, persistProgress, state.answers]);

  const answer = useCallback(
    (questionId: QuestionId, optionId: OptionId) => {
      clearTimer();

      const startedAt = state.startedAt ?? new Date().toISOString();
      const nextAnswers: AnswerMap = {
        ...state.answers,
        [questionId]: optionId,
      };
      const isLast = state.currentIndex >= TOTAL_QUESTIONS - 1;
      const nextIndex = isLast ? state.currentIndex : state.currentIndex + 1;

      persistProgress(nextAnswers, nextIndex, startedAt);

      setState((prev) => ({
        ...prev,
        answers: nextAnswers,
        startedAt,
        error: null,
      }));

      // ここが「能動的なタップ」の起点。戻る操作では呼ばれないため、
      // 既存の回答が表示されているだけの状態では自動遷移しない
      timerRef.current = setTimeout(() => {
        if (isLast) {
          goToCalculating(nextAnswers);
        } else {
          setState((prev) => ({ ...prev, currentIndex: nextIndex }));
        }
      }, ANSWER_ADVANCE_DELAY_MS);
    },
    [
      clearTimer,
      goToCalculating,
      persistProgress,
      state.answers,
      state.currentIndex,
      state.startedAt,
    ],
  );

  const goBack = useCallback(() => {
    // 自動遷移の予約が残っていると、戻った直後に進んでしまうため必ず止める
    clearTimer();

    const nextIndex = Math.max(state.currentIndex - 1, 0);
    if (state.startedAt !== null) {
      persistProgress(state.answers, nextIndex, state.startedAt);
    }

    setState((prev) => ({ ...prev, currentIndex: nextIndex, error: null }));
  }, [
    clearTimer,
    persistProgress,
    state.answers,
    state.currentIndex,
    state.startedAt,
  ]);

  const restart = useCallback(() => {
    clearTimer();
    clearDiagnosis();
    setState({ ...INITIAL_STATE, isRestored: true });
  }, [clearTimer]);

  const retryScoring = useCallback(() => {
    goToCalculating(state.answers);
  }, [goToCalculating, state.answers]);

  // --------------------------------------------------------------- 導出値
  const currentQuestion = questions[state.currentIndex];
  const selectedOptionId =
    currentQuestion === undefined
      ? undefined
      : state.answers[currentQuestion.id];

  return {
    screen: state.screen,
    isRestored: state.isRestored,
    currentQuestion,
    currentNumber: state.currentIndex + 1,
    totalQuestions: TOTAL_QUESTIONS,
    selectedOptionId,
    canGoBack: state.currentIndex > 0,
    result: state.result,
    error: state.error,
    start,
    answer,
    goBack,
    restart,
    retryScoring,
  };
}
