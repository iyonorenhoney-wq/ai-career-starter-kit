/**
 * 公式LINE CTA
 *
 * 出典:
 *   docs/01_diagnosis-spec.md §43-46
 *   docs/07_line-flow.md §12
 *   docs/08_web-spec.md §75-80
 *   docs/09_lp.md §27（攻略BOOKの内容）
 *
 * 結果画面で最も重要なCTA。
 * SNSシェアではなく、公式LINEへ結果を送ってもらうことが最優先（01 §79）。
 *
 * 構成:
 *   受け取れる価値 → 受け取り方 → CTA
 *
 * URLが未設定のときは押せない状態にして、事故を防ぐ。
 */

import { ArrowRight } from "lucide-react";
import { IS_LINE_URL_CONFIGURED, LINE_URL } from "@/lib/constants";

/** 攻略BOOKに入っているもの（01 §43 / 09 §27） */
const CONTENTS = [
  "あなたの強み",
  "注意ポイント",
  "おすすめAIツール",
  "おすすめ学習順",
  "今日やること",
  "7日チャレンジ",
  "30日ロードマップ",
  "90日ロードマップ",
] as const;

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
      className="bg-card-glow relative overflow-hidden rounded-card px-7 py-11 text-brand-white sm:px-10 sm:py-13"
      aria-labelledby="line-cta"
    >
      {/* 上辺のターコイズライン */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-turquoise to-transparent"
      />

      {/* --- 1. 受け取れる価値 --- */}
      <p className="eyebrow text-brand-turquoise">Your Career Book</p>

      <h2 id="line-cta" className="text-h3 mt-5 leading-snug font-bold">
        診断はここで終わりではありません。
        <br />
        あなた専用の続きがあります。
      </h2>

      <p className="text-brand-white/70 mt-5 text-sm leading-loose">
        診断結果に合わせた「AIキャリア攻略BOOK」を無料でお届けします。今日から7日間、何をすればいいかが1日ずつ書かれています。
      </p>

      <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-2.5">
        {CONTENTS.map((content) => (
          <li
            key={content}
            className="text-brand-white/85 flex items-start gap-2.5 text-sm leading-relaxed"
          >
            <span
              aria-hidden="true"
              className="bg-brand-turquoise mt-2 h-1 w-1 shrink-0 rounded-badge"
            />
            {content}
          </li>
        ))}
      </ul>

      {/* --- 2. 受け取り方 --- */}
      <div className="mt-10 border-t border-brand-white/10 pt-8">
        <h3 className="eyebrow text-brand-white/40">受け取り方</h3>

        <ol className="mt-5 flex flex-col">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-start gap-4">
              <div className="flex flex-col items-center self-stretch">
                <span className="label-en text-brand-turquoise text-[11px] leading-none">
                  {pad2(index + 1)}
                </span>
                {index < STEPS.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="mt-1.5 w-px flex-1 bg-brand-white/15"
                  />
                ) : null}
              </div>
              <span className="text-brand-white/90 pb-5 text-sm leading-snug">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* --- 3. CTA --- */}
      <div className="mt-2 flex flex-col gap-3">
        {IS_LINE_URL_CONFIGURED ? (
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-brand-turquoise text-brand-navy flex min-h-15 w-full items-center justify-center gap-3 rounded-btn px-6 text-center font-bold transition-colors hover:bg-brand-turquoise-light"
          >
            専用攻略BOOKを受け取る
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        ) : (
          <>
            <button
              type="button"
              disabled
              className="flex min-h-15 w-full cursor-not-allowed items-center justify-center rounded-btn border border-brand-white/20 px-6 text-center font-bold text-brand-white/45"
            >
              専用攻略BOOKを受け取る
            </button>
            <p
              role="status"
              className="text-brand-turquoise-light text-center text-xs"
            >
              公式LINEは準備中です
            </p>
          </>
        )}

        <p className="text-brand-white/45 mt-1 text-center text-xs leading-relaxed">
          「今一番変えたいこと」は長文でなくて大丈夫です。
          <br />
          「仕事でAIを使いたい」「副業を始めたい」くらいでOK。
        </p>
      </div>
    </section>
  );
}
