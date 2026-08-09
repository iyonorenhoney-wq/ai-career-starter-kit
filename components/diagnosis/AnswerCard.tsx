"use client";

/**
 * 回答カード
 *
 * 出典: docs/01_diagnosis-spec.md §14, §58 / docs/08_web-spec.md §43-46, §112
 *
 * アクセシビリティ:
 *   - タップ領域は48px以上（08 §46）
 *   - 選択状態を色だけで示さず、チェックアイコンも併用する（08 §112）
 *   - キーボードで操作でき、フォーカスが見える（08 §110-111）
 */

import type { OptionId } from "@/types/diagnosis";

type AnswerCardProps = {
  optionId: OptionId;
  label: string;
  selected: boolean;
  onSelect: (optionId: OptionId) => void;
};

/** 選択済みを示すチェックアイコン。色以外の手がかりとして必ず表示する */
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="10" cy="10" r="10" className="fill-brand-turquoise" />
      <path
        d="M5.5 10.5l3 3 6-6.5"
        fill="none"
        stroke="#070A0F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AnswerCard({
  optionId,
  label,
  selected,
  onSelect,
}: AnswerCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(optionId)}
      className={[
        "flex w-full items-center gap-3 rounded-card border p-5 text-left",
        "min-h-12 transition-colors duration-150",
        selected
          ? "border-brand-accent-blue bg-brand-tint"
          : "border-brand-border bg-brand-white hover:border-brand-accent-blue",
      ].join(" ")}
    >
      <span className="flex-1">{label}</span>

      {/* レイアウトのがたつきを防ぐため、未選択時も同じ幅を確保する */}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        {selected ? <CheckIcon /> : null}
      </span>
    </button>
  );
}
