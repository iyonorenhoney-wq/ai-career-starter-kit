/**
 * localStorage への保存・復元のテスト
 *
 * 出典: docs/02_scoring-system.md §70-73 / docs/08_web-spec.md §85-88, §95
 *
 * 重要なのは「壊れたデータや使えない環境でもアプリを止めないこと」。
 * 復元処理が例外を投げると診断画面が空のまま止まるため、
 * 起こりうる異常をひととおり確認する。
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DIAGNOSIS_VERSION, STORAGE_KEYS } from "@/lib/constants";
import {
  clearDiagnosis,
  loadProgress,
  loadResult,
  saveProgress,
  saveResult,
} from "@/lib/diagnosisStorage";
import type { DiagnosisProgress, DiagnosisResult } from "@/types/diagnosis";

/** テスト用の正常な診断結果 */
const RESULT: DiagnosisResult = {
  resultId: "AI-260809-K4M2",
  mainType: "creator",
  subType: "builder",
  primaryGoal: "side",
  secondaryGoal: "both",
  style: "hybrid",
  rawScores: {
    smart_worker: 4,
    creator: 9,
    supporter: 3,
    producer: 5,
    builder: 8,
  },
  displayScores: {
    smart_worker: 27,
    creator: 60,
    supporter: 20,
    producer: 33,
    builder: 53,
  },
  goalScores: { work: 0, side: 7, both: 0 },
  routeId: "creator_side",
  completedAt: "2026-08-09T00:00:00.000Z",
};

const PROGRESS: DiagnosisProgress = {
  currentQuestion: 3,
  answers: { q1: "q1_b", q2: "q2_a" },
  startedAt: "2026-08-09T00:00:00.000Z",
};

/** 実際の localStorage の代わりに使う簡易実装 */
function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => [...map.keys()][index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
}

/**
 * window.localStorage を差し替える。
 *
 * テストはNode環境で動かすため、jsdom等を追加せずに
 * 必要最小限の window を用意して差し替える。
 */
type FakeWindow = { localStorage: Storage };
type GlobalWithWindow = { window?: FakeWindow };

/** globalThis を、window を差し替えられる形として扱う */
const scope = globalThis as unknown as GlobalWithWindow;

function useStorage(storage: Storage | (() => never)): void {
  scope.window = scope.window ?? ({} as FakeWindow);
  Object.defineProperty(scope.window, "localStorage", {
    configurable: true,
    get: typeof storage === "function" ? storage : () => storage,
  });
}

/** 差し替えた window を読むための入口 */
function fakeWindow(): FakeWindow {
  const win = scope.window;
  if (win === undefined) throw new Error("window が用意されていません");
  return win;
}

beforeEach(() => {
  useStorage(createMemoryStorage());
});

afterEach(() => {
  vi.restoreAllMocks();
  delete scope.window;
});

// ============================================================================
describe("正常な保存と復元", () => {
  it("保存した結果を復元できる", () => {
    saveResult(RESULT);
    expect(loadResult()).toEqual(RESULT);
  });

  it("保存した進捗を復元できる", () => {
    saveProgress(PROGRESS);
    expect(loadProgress()).toEqual(PROGRESS);
  });

  it("何も保存されていなければ null を返す", () => {
    expect(loadResult()).toBeNull();
    expect(loadProgress()).toBeNull();
  });

  it("clearDiagnosis で両方とも消える", () => {
    saveResult(RESULT);
    saveProgress(PROGRESS);
    clearDiagnosis();
    expect(loadResult()).toBeNull();
    expect(loadProgress()).toBeNull();
  });

  it("保存データに診断バージョンが含まれる（02 §72）", () => {
    saveResult(RESULT);
    const raw = fakeWindow().localStorage.getItem(STORAGE_KEYS.result);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw ?? "{}")).toMatchObject({
      diagnosisVersion: DIAGNOSIS_VERSION,
    });
  });
});

// ============================================================================
describe("壊れたデータを渡されたとき", () => {
  const brokenValues = [
    ["JSONとして壊れている", "{壊れたJSON"],
    ["配列が入っている", "[1,2,3]"],
    ["文字列が入っている", '"hello"'],
    ["nullが入っている", "null"],
    ["中身が空", "{}"],
  ] as const;

  it.each(brokenValues)("結果: %s なら null を返す", (_label, value) => {
    fakeWindow().localStorage.setItem(STORAGE_KEYS.result, value);
    expect(loadResult()).toBeNull();
  });

  it.each(brokenValues)("進捗: %s なら null を返す", (_label, value) => {
    fakeWindow().localStorage.setItem(STORAGE_KEYS.progress, value);
    expect(loadProgress()).toBeNull();
  });

  it("結果の必須項目が欠けていれば null を返す", () => {
    fakeWindow().localStorage.setItem(
      STORAGE_KEYS.result,
      JSON.stringify({
        diagnosisVersion: DIAGNOSIS_VERSION,
        result: { mainType: "creator" },
      }),
    );
    expect(loadResult()).toBeNull();
  });

  it("進捗の型が違えば null を返す", () => {
    fakeWindow().localStorage.setItem(
      STORAGE_KEYS.progress,
      JSON.stringify({
        diagnosisVersion: DIAGNOSIS_VERSION,
        progress: { currentQuestion: "3", answers: { q1: 123 }, startedAt: 5 },
      }),
    );
    expect(loadProgress()).toBeNull();
  });
});

// ============================================================================
describe("診断バージョンが違うとき（02 §73）", () => {
  it("古いバージョンの結果は復元しない", () => {
    fakeWindow().localStorage.setItem(
      STORAGE_KEYS.result,
      JSON.stringify({ diagnosisVersion: "0.0.1", result: RESULT }),
    );
    expect(loadResult()).toBeNull();
  });

  it("古いバージョンの進捗は復元しない", () => {
    fakeWindow().localStorage.setItem(
      STORAGE_KEYS.progress,
      JSON.stringify({ diagnosisVersion: "0.0.1", progress: PROGRESS }),
    );
    expect(loadProgress()).toBeNull();
  });

  it("バージョンが無ければ復元しない", () => {
    fakeWindow().localStorage.setItem(
      STORAGE_KEYS.result,
      JSON.stringify({ result: RESULT }),
    );
    expect(loadResult()).toBeNull();
  });
});

// ============================================================================
describe("localStorage が使えない環境（Safariのプライベートブラウズ等）", () => {
  it("読み込みで例外を投げず null を返す", () => {
    useStorage(() => {
      throw new DOMException("The operation is insecure.", "SecurityError");
    });

    expect(() => loadResult()).not.toThrow();
    expect(() => loadProgress()).not.toThrow();
    expect(loadResult()).toBeNull();
    expect(loadProgress()).toBeNull();
  });

  it("保存で例外を投げない", () => {
    useStorage(() => {
      throw new DOMException("The operation is insecure.", "SecurityError");
    });

    expect(() => saveResult(RESULT)).not.toThrow();
    expect(() => saveProgress(PROGRESS)).not.toThrow();
    expect(() => clearDiagnosis()).not.toThrow();
  });

  it("容量超過で保存できなくても例外を投げない", () => {
    const storage = createMemoryStorage();
    vi.spyOn(storage, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError", "QuotaExceededError");
    });
    useStorage(storage);

    expect(() => saveResult(RESULT)).not.toThrow();
    expect(() => saveProgress(PROGRESS)).not.toThrow();
  });
});
