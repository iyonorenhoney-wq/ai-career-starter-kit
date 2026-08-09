"use client";

/**
 * 診断本体のコンテナ
 *
 * 出典: docs/01_diagnosis-spec.md §68-69 / docs/08_web-spec.md §7-8
 *
 * 1ページ内で intro → question → calculating → result を切り替える。
 * このコンポーネントの責務は「どの画面を出すか」だけで、
 * 採点も保存も行わない（useDiagnosis と lib/ に任せる）。
 */

import { DiagnosisCalculating } from "@/components/diagnosis/DiagnosisCalculating";
import { DiagnosisIntro } from "@/components/diagnosis/DiagnosisIntro";
import { DiagnosisQuestion } from "@/components/diagnosis/DiagnosisQuestion";
import { useDiagnosis } from "@/hooks/useDiagnosis";
import type { DiagnosisResult } from "@/types/diagnosis";

/**
 * 採点に失敗したときの表示。
 * 出典: docs/08_web-spec.md §94
 */
function ScoringError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-4 rounded-card border border-brand-border bg-brand-off-white p-5"
    >
      <p className="text-sm">
        診断結果の計算に失敗しました。
        <br />
        もう一度お試しください。
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-12 self-start rounded-btn border border-brand-accent-blue px-5 text-sm font-semibold text-brand-accent-blue"
      >
        もう一度計算する
      </button>
    </div>
  );
}

/**
 * 結果画面の仮表示。
 *
 * 正式な結果画面は STEP6 で実装する。
 * ここでは採点が正しく通っているかを確認するための最小限の表示にとどめる。
 */
function ResultPlaceholder({
  result,
  onRestart,
}: {
  result: DiagnosisResult;
  onRestart: () => void;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="label-en text-brand-accent-blue text-xs">Result</p>
        <h1 className="text-h3 font-bold">診断が完了しました</h1>
        <p className="text-sm text-brand-black/60">
          結果画面は STEP6 で実装します。以下は採点結果の確認用表示です。
        </p>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-card bg-brand-off-white p-5 text-sm">
        <dt className="text-brand-black/55">MAIN TYPE</dt>
        <dd className="font-semibold">{result.mainType}</dd>
        <dt className="text-brand-black/55">SUB TYPE</dt>
        <dd className="font-semibold">{result.subType}</dd>
        <dt className="text-brand-black/55">GOAL</dt>
        <dd className="font-semibold">{result.primaryGoal}</dd>
        <dt className="text-brand-black/55">SECONDARY GOAL</dt>
        <dd>{result.secondaryGoal}</dd>
        <dt className="text-brand-black/55">STYLE</dt>
        <dd className="font-semibold">{result.style}</dd>
        <dt className="text-brand-black/55">ROUTE ID</dt>
        <dd>{result.routeId}</dd>
        <dt className="text-brand-black/55">RESULT ID</dt>
        <dd>{result.resultId}</dd>
        <dt className="text-brand-black/55">AI活用スコア</dt>
        <dd>
          {Object.entries(result.displayScores)
            .map(([type, score]) => `${type} ${score}`)
            .join(" / ")}
        </dd>
      </dl>

      <button
        type="button"
        onClick={onRestart}
        className="min-h-12 self-start rounded-btn border border-brand-border px-5 text-sm"
      >
        もう一度診断する
      </button>
    </section>
  );
}

export function DiagnosisContainer() {
  const {
    screen,
    isRestored,
    currentQuestion,
    currentNumber,
    totalQuestions,
    selectedOptionId,
    canGoBack,
    result,
    error,
    start,
    answer,
    goBack,
    restart,
    retryScoring,
  } = useDiagnosis();

  // 復元が終わるまでは何も出さない。
  // サーバー側の描画と食い違って画面がちらつくのを防ぐため。
  if (!isRestored) {
    return <div className="min-h-[60vh]" aria-hidden="true" />;
  }

  if (screen === "calculating") {
    return <DiagnosisCalculating />;
  }

  if (screen === "result" && result !== null) {
    return <ResultPlaceholder result={result} onRestart={restart} />;
  }

  if (screen === "question" && currentQuestion !== undefined) {
    return (
      <div className="flex flex-col gap-6">
        {error !== null ? <ScoringError onRetry={retryScoring} /> : null}
        <DiagnosisQuestion
          question={currentQuestion}
          currentNumber={currentNumber}
          totalQuestions={totalQuestions}
          selectedOptionId={selectedOptionId}
          canGoBack={canGoBack}
          onAnswer={answer}
          onBack={goBack}
        />
      </div>
    );
  }

  return <DiagnosisIntro totalQuestions={totalQuestions} onStart={start} />;
}
