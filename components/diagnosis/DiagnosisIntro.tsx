"use client";

/**
 * 診断開始画面
 *
 * 出典: docs/01_diagnosis-spec.md §10-11 / docs/08_web-spec.md §38
 *
 * この画面では5タイプの詳細・採点ルール・商品導線を出さない。
 * 回答の誘導を防ぐため（01 §11）。
 */

type DiagnosisIntroProps = {
  totalQuestions: number;
  onStart: () => void;
};

export function DiagnosisIntro({
  totalQuestions,
  onStart,
}: DiagnosisIntroProps) {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {/* ブランド表記はページ上部にあるため、ここでは繰り返さない */}
        <h1 className="text-h2 font-bold">AI仕事診断</h1>

        <p className="text-brand-black/70">
          仕事効率化・制作・副業・商品化・仕組み化。
          <br />
          {totalQuestions}個の質問から、
          <strong className="font-semibold">
            あなたがAIをどう使うと力を発揮しやすいか
          </strong>
          を診断します。
        </p>
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-black/60">
        <li>全{totalQuestions}問</li>
        <li>約2〜3分</li>
        <li>無料</li>
      </ul>

      <p className="rounded-card bg-brand-off-white p-5 text-sm text-brand-black/75">
        正解はありません。
        <br />
        「今の自分に一番近い」と思うものを選んでください。
      </p>

      <button
        type="button"
        onClick={onStart}
        className="bg-brand-gradient min-h-14 w-full rounded-btn px-6 font-semibold text-brand-white transition-transform hover:-translate-y-px"
      >
        診断をはじめる
      </button>
    </section>
  );
}
