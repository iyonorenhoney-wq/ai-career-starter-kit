import type { Metadata } from "next";
import { DiagnosisContainer } from "@/components/diagnosis/DiagnosisContainer";

/**
 * 診断ページ。
 *
 * 出典: docs/08_web-spec.md §6-7, §28, §31
 *
 * 診断本体は1ページ内の状態管理で完結させる。
 * 画面幅は広げすぎず、中央配置にする（01 §57）。
 */
export const metadata: Metadata = {
  title: "AI仕事診断｜10問であなたに合うAI活用を診断",
  description:
    "全10問・約2〜3分。あなたに合うAI仕事スタイルと、次にやることを整理します。",
};

export default function DiagnosisPage() {
  return (
    <main className="mx-auto w-full max-w-[720px] px-5 py-10 sm:py-16">
      {/* 診断中は離脱を減らすため、ヘッダーはブランド表記のみにとどめる（08 §31） */}
      <p className="label-en mb-10 text-[11px] text-brand-black/40">
        AI Career Starter Kit
      </p>

      <DiagnosisContainer />
    </main>
  );
}
