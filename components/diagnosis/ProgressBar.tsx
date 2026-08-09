/**
 * 診断の進捗バー
 *
 * 出典: docs/01_diagnosis-spec.md §12 / docs/08_web-spec.md §40
 *
 * ベースは薄いグレー、進捗部分は ACCENT BLUE → TURQUOISE のグラデーション。
 */

type ProgressBarProps = {
  /** 現在の質問番号（1始まり） */
  current: number;
  /** 質問の総数 */
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`全${total}問中${current}問目`}
      className="h-1.5 w-full overflow-hidden rounded-badge bg-brand-border"
    >
      <div
        className="bg-progress-gradient h-full rounded-badge transition-[width] duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
