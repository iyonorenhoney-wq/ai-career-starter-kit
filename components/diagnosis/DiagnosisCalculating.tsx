"use client";

/**
 * 計算演出画面
 *
 * 出典: docs/01_diagnosis-spec.md §70-71 / docs/08_web-spec.md §49-50
 *
 * 背景はダーク。メッセージを順に切り替え、約1〜2秒で結果へ進む。
 *
 * デザイン方針:
 *   「AIが解析している」と感じる程度にとどめる。
 *   走査線と淡い明滅だけで、粒子や3Dは使わない。すべてCSSで実装する。
 */

import { useEffect, useState } from "react";
import { CALCULATING_MESSAGES, CALCULATING_STEP_MS } from "@/lib/constants";

export function DiagnosisCalculating() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // 最後のメッセージまで来たら止める
    if (step >= CALCULATING_MESSAGES.length - 1) return;

    const timer = setTimeout(
      () => setStep((prev) => prev + 1),
      CALCULATING_STEP_MS,
    );
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <section
      className="bg-card-glow relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden rounded-card px-6 py-16 text-center"
      aria-busy="true"
    >
      {/* 背景の細いグリッド */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #4BD6D6 1px, transparent 1px), linear-gradient(to bottom, #4BD6D6 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* 上下に流れる走査線。解析している感じを出す */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[8%] overflow-visible"
      >
        <div className="animate-scan h-px w-full bg-gradient-to-r from-transparent via-brand-turquoise to-transparent" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* 3つのステップを点で示し、進んでいることを分かるようにする */}
        <div className="flex items-center gap-2" aria-hidden="true">
          {CALCULATING_MESSAGES.map((message, index) => (
            <span
              key={message}
              className={
                index === step
                  ? "animate-soft-pulse h-1.5 w-1.5 rounded-badge bg-brand-turquoise"
                  : index < step
                    ? "h-1.5 w-1.5 rounded-badge bg-brand-turquoise/50"
                    : "h-1.5 w-1.5 rounded-badge bg-brand-white/20"
              }
            />
          ))}
        </div>

        <p className="text-brand-white text-lg leading-relaxed font-bold">
          あなたのAI仕事スタイルを
          <br />
          分析しています
        </p>

        {/* メッセージが切り替わるたびにフェードさせる */}
        <p
          key={step}
          className="animate-fade-up eyebrow text-brand-turquoise"
          aria-live="polite"
        >
          {CALCULATING_MESSAGES[step] ?? CALCULATING_MESSAGES[0]}
        </p>
      </div>
    </section>
  );
}
