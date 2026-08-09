"use client";

/**
 * AI活用スコア
 *
 * 出典: docs/01_diagnosis-spec.md §29-31, §34（スコアの呼び方）
 *       docs/08_web-spec.md §68-71
 *
 * 5タイプすべてを、数値とレーダーチャートの両方で表示する。
 *
 * デザイン方針:
 *   グラフを見るサイトではなく診断結果を見るサイトなので、
 *   数値表を主役にし、チャートは補助として控えめに置く。
 *   MAIN / SUB の数値が自然に目へ入ることを優先する。
 *
 * 「適性率」「成功率」とは呼ばない（02 §29）。
 */

import dynamic from "next/dynamic";
import { getScoreRows } from "@/lib/resultLabels";
import type { DiagnosisResult } from "@/types/diagnosis";

/**
 * Recharts は結果画面に到達したときだけ読み込む。
 * サーバー側では描画しない（チャートはブラウザでのみ必要なため）。
 */
const ScoreRadarChart = dynamic(
  () => import("@/components/result/ScoreRadarChart"),
  {
    ssr: false,
    loading: () => <div className="h-[220px] w-full" aria-hidden="true" />,
  },
);

type ScoreSectionProps = {
  result: DiagnosisResult;
};

export function ScoreSection({ result }: ScoreSectionProps) {
  const rows = getScoreRows(result);

  return (
    <section className="flex flex-col" aria-labelledby="score">
      <p className="eyebrow text-brand-turquoise">AI Score</p>
      <h2 id="score" className="text-h3 mt-4 font-bold">
        AI活用スコア
      </h2>

      {/* 数値表を主役にする。罫線で区切り、カードを増やさない */}
      <ul className="mt-8 flex flex-col">
        {rows.map((row) => (
          <li
            key={row.type}
            className="flex flex-col gap-2 border-t border-brand-border py-4"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex items-baseline gap-2.5">
                <span
                  className={
                    row.isMain
                      ? "text-brand-navy text-base font-bold"
                      : "text-brand-black/70 text-sm"
                  }
                >
                  {row.label}
                </span>
                {row.isMain ? (
                  <span className="eyebrow text-brand-turquoise text-[10px]">
                    Main
                  </span>
                ) : null}
                {row.isSub ? (
                  <span className="eyebrow text-brand-black/35 text-[10px]">
                    Sub
                  </span>
                ) : null}
              </span>

              <span
                className={`label-en tabular-nums ${
                  row.isMain
                    ? "text-brand-navy text-2xl leading-none font-bold"
                    : "text-brand-black/45 text-base leading-none"
                }`}
              >
                {row.score}
              </span>
            </div>

            {/* MAIN / SUB だけ線で強調し、他は静かに置く */}
            <div
              className="bg-brand-border/60 h-px w-full overflow-hidden"
              aria-hidden="true"
            >
              <div
                className={`h-px ${
                  row.isMain
                    ? "bg-brand-turquoise"
                    : row.isSub
                      ? "bg-brand-navy/40"
                      : "bg-brand-navy/15"
                }`}
                style={{ width: `${row.score}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* チャートは補助。数値表の下に控えめに置く */}
      <div className="mt-8 border-t border-brand-border pt-6">
        <h3 className="eyebrow text-brand-black/35">Balance</h3>
        <ScoreRadarChart rows={rows} />
      </div>

      {/* 能力評価ではないことを明示する（02 §34） */}
      <p className="text-brand-black/45 mt-4 text-xs leading-relaxed">
        AI活用スコアは、あなたの回答傾向から各AI活用スタイルとの近さを数値化したものです。能力や成功確率を示すものではありません。
      </p>
    </section>
  );
}
