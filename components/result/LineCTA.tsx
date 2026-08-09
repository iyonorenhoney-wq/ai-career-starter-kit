/**
 * 公式LINE CTA
 *
 * 出典:
 *   docs/01_diagnosis-spec.md §43-46
 *   docs/07_line-flow.md §12
 *   docs/08_web-spec.md §75-80
 *
 * 結果画面で最も重要なCTA。
 * SNSシェアではなく、公式LINEへ結果を送ってもらうことが最優先（01 §79）。
 *
 * URLが未設定のときは押せない状態にして、事故を防ぐ。
 */

import { IS_LINE_URL_CONFIGURED, LINE_URL } from "@/lib/constants";

/** 受け取りまでの4ステップ（08 §76） */
const STEPS = [
  "この結果をスクショ",
  "公式LINEを追加",
  "スクショ ＋「今一番変えたいこと」を送信",
  "あなた専用攻略BOOKを受け取る",
] as const;

/** 2桁ゼロ埋め */
const pad2 = (value: number): string => String(value).padStart(2, "0");

export function LineCTA() {
  return (
    <section
      className="bg-dark-gradient flex flex-col gap-7 rounded-card px-6 py-9 text-brand-white sm:px-8 sm:py-10"
      aria-labelledby="line-cta"
    >
      <div className="flex flex-col gap-3">
        <p className="label-en text-xs text-brand-turquoise">
          Get Your Career Book
        </p>
        <h2 id="line-cta" className="text-h3 leading-snug font-bold">
          あなた専用の
          <br />
          AIキャリア攻略BOOKを受け取る
        </h2>
        <p className="text-sm leading-relaxed text-brand-white/75">
          診断結果に合わせて、あなたの強み・おすすめAI・7日チャレンジ・30日/90日ロードマップ・実践プロンプトをまとめた専用攻略BOOKを用意しています。
        </p>
      </div>

      {/* 受け取り手順 */}
      <ol className="flex flex-col gap-3 border-t border-brand-white/10 pt-6">
        {STEPS.map((step, index) => (
          <li key={step} className="flex items-start gap-3">
            <span className="label-en mt-px shrink-0 text-xs text-brand-turquoise">
              {pad2(index + 1)}
            </span>
            <span className="text-sm text-brand-white/90">{step}</span>
          </li>
        ))}
      </ol>

      {/* CTA。URL未設定時は押せない状態にする */}
      <div className="flex flex-col gap-3">
        {IS_LINE_URL_CONFIGURED ? (
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-gradient flex min-h-14 w-full items-center justify-center rounded-btn px-6 text-center font-bold text-brand-white transition-transform hover:-translate-y-px"
          >
            専用攻略BOOKを受け取る
          </a>
        ) : (
          <>
            <button
              type="button"
              disabled
              className="flex min-h-14 w-full cursor-not-allowed items-center justify-center rounded-btn border border-brand-white/20 bg-brand-white/10 px-6 text-center font-bold text-brand-white/40"
            >
              専用攻略BOOKを受け取る
            </button>
            <p
              role="status"
              className="text-center text-xs text-brand-turquoise-light"
            >
              公式LINEは準備中です
            </p>
          </>
        )}

        <p className="text-center text-xs text-brand-white/50">
          長文でなくて大丈夫です。「仕事でAIを使いたい」「副業を始めたい」くらいでOK。
        </p>
      </div>
    </section>
  );
}
