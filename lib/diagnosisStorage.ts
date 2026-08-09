/**
 * AI仕事診断｜localStorage への保存・復元
 *
 * 出典:
 *   docs/01_diagnosis-spec.md §19-20, §47, §52, §73
 *   docs/02_scoring-system.md §70-73
 *   docs/08_web-spec.md §85-88, §95
 *
 * 方針:
 *   - localStorage が使えない環境（SSR・プライベートブラウズ・容量超過）でも
 *     アプリを壊さない。読めなければ null、書けなければ黙って諦める
 *   - 保存データの diagnosisVersion が現在と異なる場合は破棄する
 *   - 復元したデータは信用せず、形だけ検証してから返す
 */

import { DIAGNOSIS_VERSION, STORAGE_KEYS } from "@/lib/constants";
import type {
  DiagnosisProgress,
  DiagnosisResult,
  StoredDiagnosisProgress,
  StoredDiagnosisResult,
} from "@/types/diagnosis";

/** localStorage が利用できるか（SSR・設定による無効化を考慮） */
function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    // プライバシー設定などでアクセスが拒否される場合がある
    return null;
  }
}

/** JSONを読み込む。壊れていれば null */
function readJson(key: string): unknown {
  const storage = getStorage();
  if (storage === null) return null;
  try {
    const raw = storage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

/** JSONを書き込む。失敗しても例外を投げない */
function writeJson(key: string, value: unknown): void {
  const storage = getStorage();
  if (storage === null) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // 容量超過などは診断の続行を妨げないため無視する
  }
}

/** キーを削除する */
function removeKey(key: string): void {
  const storage = getStorage();
  if (storage === null) return;
  try {
    storage.removeItem(key);
  } catch {
    // 何もしない
  }
}

/** オブジェクトかどうか */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * 保存データのバージョンが現在と一致するか。
 *
 * 一致しない場合、古い質問・古い採点で作られたデータなので破棄する
 * （docs/02_scoring-system.md §73）。
 */
function hasCurrentVersion(value: Record<string, unknown>): boolean {
  return value["diagnosisVersion"] === DIAGNOSIS_VERSION;
}

/** answers が「質問ID → 選択肢ID」の形をしているか（値の妥当性は採点側で検証する） */
function isAnswerShape(value: unknown): value is Record<string, string> {
  if (!isRecord(value)) return false;
  return Object.values(value).every((v) => typeof v === "string");
}

// ============================================================================
// 診断途中の進捗
// ============================================================================

/**
 * 診断途中の進捗を保存する。
 * 出典: docs/01_diagnosis-spec.md §19-20
 */
export function saveProgress(progress: DiagnosisProgress): void {
  const payload: StoredDiagnosisProgress = {
    diagnosisVersion: DIAGNOSIS_VERSION,
    progress,
  };
  writeJson(STORAGE_KEYS.progress, payload);
}

/**
 * 診断途中の進捗を復元する。
 *
 * 見つからない・壊れている・バージョンが違う場合は null を返す。
 */
export function loadProgress(): DiagnosisProgress | null {
  const raw = readJson(STORAGE_KEYS.progress);
  if (!isRecord(raw) || !hasCurrentVersion(raw)) return null;

  const progress = raw["progress"];
  if (!isRecord(progress)) return null;

  const { currentQuestion, answers, startedAt } = progress;
  if (typeof currentQuestion !== "number" || !Number.isFinite(currentQuestion)) {
    return null;
  }
  if (!isAnswerShape(answers)) return null;
  if (typeof startedAt !== "string") return null;

  return {
    currentQuestion,
    answers,
    startedAt,
  } as DiagnosisProgress;
}

/** 診断途中の進捗を削除する */
export function clearProgress(): void {
  removeKey(STORAGE_KEYS.progress);
}

// ============================================================================
// 診断結果
// ============================================================================

/**
 * 診断結果を保存する。
 *
 * 公式LINEへ移動して戻ってきても結果を確認できるようにするため
 * （docs/01_diagnosis-spec.md §47, §73）。
 */
export function saveResult(result: DiagnosisResult): void {
  const payload: StoredDiagnosisResult = {
    diagnosisVersion: DIAGNOSIS_VERSION,
    result,
  };
  writeJson(STORAGE_KEYS.result, payload);
}

/**
 * 診断結果を復元する。
 *
 * バージョンが違う結果は、現在の質問・採点と食い違うため復元しない。
 */
export function loadResult(): DiagnosisResult | null {
  const raw = readJson(STORAGE_KEYS.result);
  if (!isRecord(raw) || !hasCurrentVersion(raw)) return null;

  const result = raw["result"];
  if (!isRecord(result)) return null;

  // 結果画面の表示に最低限必要な項目がそろっているかだけ確認する
  const required = [
    "resultId",
    "mainType",
    "subType",
    "primaryGoal",
    "secondaryGoal",
    "style",
    "routeId",
  ];
  if (required.some((key) => typeof result[key] !== "string")) return null;
  if (!isRecord(result["rawScores"])) return null;
  if (!isRecord(result["displayScores"])) return null;
  if (!isRecord(result["goalScores"])) return null;

  return result as unknown as DiagnosisResult;
}

/** 診断結果を削除する */
export function clearResult(): void {
  removeKey(STORAGE_KEYS.result);
}

// ============================================================================
// まとめて削除
// ============================================================================

/**
 * 再診断のためにすべて削除する。
 * 出典: docs/01_diagnosis-spec.md §52
 */
export function clearDiagnosis(): void {
  clearProgress();
  clearResult();
}
