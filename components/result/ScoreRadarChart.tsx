"use client";

/**
 * AI活用スコアのレーダーチャート
 *
 * 出典: docs/01_diagnosis-spec.md §31 / docs/08_web-spec.md §69-71
 *
 * 重要:
 *   Recharts は軽くないため、このコンポーネントは結果画面から
 *   遅延読み込みされる（ScoreSection 側で dynamic import している）。
 *   LP・診断中の初期表示には影響しない。
 *
 * 色はブランドカラーのみを使用する。
 */

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { ScoreRow } from "@/lib/resultLabels";

/** ブランドカラー（globals.css の値と対応させる） */
const TURQUOISE = "#4BD6D6";
const NAVY = "#0B1D33";

type ScoreRadarChartProps = {
  rows: readonly ScoreRow[];
};

export default function ScoreRadarChart({ rows }: ScoreRadarChartProps) {
  const data = rows.map((row) => ({ label: row.label, score: row.score }));

  return (
    // チャートは数値表と同じ情報を図にしたもののため、読み上げからは除外する
    <div className="h-[260px] w-full sm:h-[300px]" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke={NAVY} strokeOpacity={0.14} />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: NAVY, fontSize: 12, opacity: 0.75 }}
          />
          {/* 0〜100で固定し、回答によって軸の目盛りが変わらないようにする */}
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="score"
            stroke={TURQUOISE}
            strokeWidth={2}
            fill={TURQUOISE}
            fillOpacity={0.22}
            dot={{ fill: TURQUOISE, r: 3, strokeWidth: 0 }}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
