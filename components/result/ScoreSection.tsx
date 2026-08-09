"use client";

/**
 * AI活用スコア
 *
 * 出典: docs/01_diagnosis-spec.md §29-31, §34（スコアの呼び方）
 *       docs/08_web-spec.md §68-71
 *
 * 5タイプすべてを、数値とレーダーチャートの両方で表示する。
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
    loading: () => (
      <div
        className="h-[260px] w-full sm:h-[300px]"
        aria-hidden="true"
      />
    ),
  },
);

type ScoreSectionProps = {
  result: DiagnosisResult;
};

export function ScoreSection({ result }: ScoreSectionProps) {
  const rows = getScoreRows(result);

  return (
    <section className="flex flex-col gap-6" aria-labelledby="score">
      <div className="flex flex-col gap-2">
        <p className="label-en text-xs text-brand-accent-blue">AI Score</p>
        <h2 id="score" className="text-h3 font-bold">
          AI活用スコア
        </h2>
      </div>

      <div className="rounded-card border border-brand-border bg-brand-white p-4 shadow-card sm:p-6">
        <ScoreRadarChart rows={rows} />

        {/* 数値表。チャートと同じ値を、読み上げ・確認用に必ず併記する */}
        <ul className="mt-2 flex flex-col gap-3">
          {rows.map((row) => (
            <li key={row.type} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="flex items-center gap-2 text-sm">
                  <span
                    className={
                      row.isMain ? "font-bold text-brand-navy" : undefined
                    }
                  >
                    {row.label}
                  </span>
                  {row.isMain ? (
                    <span className="label-en rounded-badge bg-brand-navy px-2 py-0.5 text-[10px] text-brand-white">
                      Main
                    </span>
                  ) : null}
                  {row.isSub ? (
                    <span className="label-en rounded-badge border border-brand-turquoise bg-brand-turquoise/15 px-2 py-0.5 text-[10px] text-brand-navy">
                      Sub
                    </span>
                  ) : null}
                </span>

                <span
                  className={`label-en text-sm ${
                    row.isMain ? "font-bold text-brand-navy" : "text-brand-black/70"
                  }`}
                >
                  {row.score}
                </span>
              </div>

              {/* 数値だけでなくバーでも見せる */}
              <div
                className="h-1.5 w-full overflow-hidden rounded-badge bg-brand-off-white"
                aria-hidden="true"
              >
                <div
                  className={
                    row.isMain
                      ? "bg-progress-gradient h-full rounded-badge"
                      : "h-full rounded-badge bg-brand-navy/25"
                  }
                  style={{ width: `${row.score}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 能力評価ではないことを明示する（02 §34） */}
      <p className="text-xs leading-relaxed text-brand-black/50">
        AI活用スコアは、あなたの回答傾向から各AI活用スタイルとの近さを数値化したものです。能力や成功確率を示すものではありません。
      </p>
    </section>
  );
}
