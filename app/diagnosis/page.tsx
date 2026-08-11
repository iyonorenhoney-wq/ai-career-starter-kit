import type { Metadata } from "next";
import { DiagnosisContainer } from "@/components/diagnosis/DiagnosisContainer";
import { PageViewTracker } from "@/components/ui/PageViewTracker";

/**
 * 診断ページ。
 *
 * 出典: docs/08_web-spec.md §6-7, §28, §31
 *
 * 診断本体は1ページ内の状態管理で完結させる。
 * 画面幅は広げすぎず、中央配置にする（01 §57）。
 *
 * 診断中は離脱を減らすため、ヘッダーはブランド表記のみにとどめる（08 §31）。
 */
export const metadata: Metadata = {
  title: "AI仕事診断｜10問であなたに合うAI活用を診断",
  description:
    "全10問・約2分。あなたに合うAI仕事スタイルと、次にやることを整理します。",
};

export default function DiagnosisPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageViewTracker event="diagnosis_view" />

      <header className="mx-auto w-full max-w-[720px] px-6 pt-7 pb-2">
        <p className="eyebrow text-brand-black/35">AI Career Starter Kit</p>
      </header>

      <main className="mx-auto w-full max-w-[720px] flex-1 px-6 pt-8 pb-20 sm:pt-12">
        {/*
          診断はJavaScriptで動くため、読み込めていないと画面が空になる。
          その場合に何が起きているのか分かるよう案内を出す。
        */}
        <noscript>
          <div className="rounded-card border border-brand-border bg-brand-off-white px-6 py-7">
            <p className="text-base font-bold">
              診断を表示できませんでした
            </p>
            <p className="text-brand-black/70 mt-3 text-sm leading-loose">
              この診断はJavaScriptを使用しています。
              <br />
              ブラウザの設定でJavaScriptを有効にしてから、ページを再読み込みしてください。
            </p>
          </div>
        </noscript>

        <DiagnosisContainer />
      </main>

      <footer className="mx-auto w-full max-w-[720px] px-6 pb-10">
        <div className="border-t border-brand-border pt-6">
          <p className="text-brand-black/30 text-xs">
            AI CAREER STARTER KIT — by MOMOKA
          </p>
        </div>
      </footer>
    </div>
  );
}
