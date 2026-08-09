/**
 * 質問番号の表示（QUESTION 03 / 10）
 *
 * 出典: docs/01_diagnosis-spec.md §12 / docs/08_web-spec.md §41
 *
 * 画面上は英字ラベルで小さく表示し、
 * 読み上げ用には日本語の状況説明を別途アナウンスする。
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
    <>
      <p className="label-en text-brand-accent-blue text-xs" aria-hidden="true">
        Question {pad2(current)} / {pad2(total)}
      </p>

      {/* 質問が切り替わったことを読み上げへ伝える */}
      <p className="sr-only" aria-live="polite">
        全{total}問中{current}問目
      </p>
    </>
  );
}
