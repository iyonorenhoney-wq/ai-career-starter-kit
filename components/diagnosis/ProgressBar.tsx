/**
 * 診断の進捗バー
 *
 * 出典: docs/01_diagnosis-spec.md §12 / docs/08_web-spec.md §40
 *
 * デザイン方針:
 *   細く上品に。ゲームのHPバーのようにしない。
 *   進捗部分だけターコイズを使い、面積を大きくしない。
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
      className="h-px w-full bg-brand-border"
    >
      <div
        className="relative h-px bg-brand-turquoise transition-[width] duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      >
        {/* 進捗の先端に小さな光を置き、現在地を分かりやすくする */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 right-0 h-1 w-1 -translate-y-1/2 rounded-badge bg-brand-turquoise"
        />
      </div>
    </div>
  );
}
