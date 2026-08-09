"use client";

/**
 * 計算演出画面
 *
 * 出典: docs/01_diagnosis-spec.md §70-71 / docs/08_web-spec.md §49-50
 *
 * 背景はダーク。メッセージを順に切り替え、約1〜2秒で結果へ進む。
 * 派手な演出は行わない（08 §50）。
 */

import { useEffect, useState } from "react";
import { CALCULATING_MESSAGES, CALCULATING_STEP_MS } from "@/lib/constants";

export function DiagnosisCalculating() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // 最後のメッセージまで来たら止める
    if (step >= CALCULATING_MESSAGES.length - 1) return;

    const timer = setTimeout(() => setStep((prev) => prev + 1), CALCULATING_STEP_MS);
    return () => clearTimeout(timer);
  }, [step]);

  const message = CALCULATING_MESSAGES[step] ?? CALCULATING_MESSAGES[0];

  return (
    <section
      className="bg-dark-gradient flex min-h-[60vh] flex-col items-center justify-center gap-6 rounded-card px-6 py-16 text-center"
      aria-busy="true"
    >
      {/* 細いリングのローディング。モーション軽減時はCSS側で停止する */}
      <span
        className="h-10 w-10 animate-spin rounded-full border-2 border-brand-turquoise/25 border-t-brand-turquoise"
        aria-hidden="true"
      />

      <p className="font-semibold text-brand-white">
        あなたのAI仕事スタイルを
        <br />
        分析しています
      </p>

      <p className="text-sm text-brand-turquoise" aria-live="polite">
        {message}
      </p>
    </section>
  );
}
