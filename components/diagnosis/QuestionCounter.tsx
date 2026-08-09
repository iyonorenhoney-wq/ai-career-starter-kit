/**
 * 質問番号の表示（QUESTION 03 / 10）
 *
 * 出典: docs/01_diagnosis-spec.md §12 / docs/08_web-spec.md §41
 *
 * デザイン方針:
 *   小さめの英字にとどめ、主役は下の質問文にする。
 *   現在地が一目で分かるよう、済んだ問はターコイズで示す。
 */

type QuestionCounterProps = {
  /** 現在の質問番号（1始まり） */
  current: number;
  /** 質問の総数 */
  total: number;
};

/** 2桁ゼロ埋め（QUESTION 03 / 10 の見た目にする） */
const pad2 = (value: number): string => String(value).padStart(2, "0");

export function QuestionCounter({ current, total }: QuestionCounterProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="eyebrow text-brand-black/40" aria-hidden="true">
        Question{" "}
        <span className="text-brand-navy">{pad2(current)}</span>
        <span className="mx-1">/</span>
        {pad2(total)}
      </p>

      {/* 何問終わったかを点で示す。数字と併記なので色だけに頼っていない */}
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={`h-1 w-1 rounded-badge ${
              index < current ? "bg-brand-turquoise" : "bg-brand-border"
            }`}
          />
        ))}
      </div>

      {/* 質問が切り替わったことを読み上げへ伝える */}
      <p className="sr-only" aria-live="polite">
        全{total}問中{current}問目
      </p>
    </div>
  );
}
