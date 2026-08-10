import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { LpAfterDiagnosis } from "@/components/lp/LpAfterDiagnosis";
import { LpCareerBook } from "@/components/lp/LpCareerBook";
import { LpCtaButton } from "@/components/lp/LpCtaButton";
import { LpFaq } from "@/components/lp/LpFaq";
import { LpFinalCta } from "@/components/lp/LpFinalCta";
import { LpHero } from "@/components/lp/LpHero";
import { LpHowToReceive } from "@/components/lp/LpHowToReceive";
import { LpProblem } from "@/components/lp/LpProblem";
import { LpWhatYouGet } from "@/components/lp/LpWhatYouGet";

/**
 * 診断LP。
 *
 * 出典: docs/09_lp.md
 *
 * 目的は商品説明ではなく「とりあえず診断してみよう」と思ってもらうこと。
 * CTAは Hero / 中盤 / Final の3箇所で、文言と遷移先を統一する（同 §42-43）。
 *
 * 背景のリズム（同 §46）:
 *   白 → オフホワイト → 白 → ダーク → 白 → オフホワイト → 白 → ダーク
 */
export const metadata: Metadata = {
  title: "AI仕事診断｜あなたに合うAI活用方法を10問で診断",
  description:
    "仕事効率化・制作・副業・商品化・仕組み化。10個の質問から、あなたに合うAI仕事スタイルと次の一歩を整理します。",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* 1. HERO */}
        <LpHero />

        {/* 2. PROBLEM */}
        <LpProblem />

        {/* 3. WHAT YOU GET（診断で分かること / 5タイプ / MAIN × SUB） */}
        <LpWhatYouGet />

        {/* 4. AFTER DIAGNOSIS */}
        <LpAfterDiagnosis />

        {/* 5. CAREER BOOK（攻略BOOK / 7日チャレンジ） */}
        <LpCareerBook />

        {/* 中盤のCTA。BOOKの中身を見たあとに置く */}
        <div className="pb-20 sm:pb-28">
          <div className="mx-auto w-full max-w-[420px] px-6">
            <LpCtaButton position="middle" />
          </div>
        </div>

        {/* 6. HOW TO RECEIVE */}
        <LpHowToReceive />

        {/* 7. FAQ ＋ この診断を作った人 */}
        <LpFaq />

        {/* 8. FINAL CTA */}
        <LpFinalCta />
      </main>

      <Footer />
    </div>
  );
}
