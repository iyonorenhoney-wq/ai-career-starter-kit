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
import { DiagnosisResult } from "@/components/result/DiagnosisResult";
import { useDiagnosis } from "@/hooks/useDiagnosis";

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
    return <DiagnosisResult result={result} onRestart={restart} />;
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
