"use client";

/**
 * 回答カード
 *
 * 出典: docs/01_diagnosis-spec.md §14, §58 / docs/08_web-spec.md §43-46, §112
 *
 * デザイン方針:
 *   白背景 + 細い境界線を基本にし、巨大な角丸カードにしない。
 *   ホバーと選択のときだけ TURQUOISE / NAVY と淡い光を使う。
 *
 * アクセシビリティ:
 *   - タップ領域は48px以上（08 §46）
 *   - 選択状態を色だけで示さず、チェックアイコンも併用する（08 §112）
 *   - キーボードで操作でき、フォーカスが見える（08 §110-111）
 */

import { Check } from "lucide-react";
import type { OptionId } from "@/types/diagnosis";

type AnswerCardProps = {
  optionId: OptionId;
  label: string;
  selected: boolean;
  onSelect: (optionId: OptionId) => void;
};

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
        "group flex w-full items-center gap-4 rounded-btn border px-5 py-4 text-left",
        "min-h-14 transition-all duration-200",
        selected
          ? "border-brand-turquoise bg-brand-white shadow-glow"
          : "border-brand-border bg-brand-white hover:border-brand-navy/40 hover:bg-brand-off-white",
      ].join(" ")}
    >
      {/* 選択の印。未選択時も同じ大きさの枠を置き、押した瞬間にがたつかせない */}
      <span
        aria-hidden="true"
        className={[
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-badge border transition-colors",
          selected
            ? "border-brand-turquoise bg-brand-turquoise"
            : "border-brand-border bg-brand-white group-hover:border-brand-navy/40",
        ].join(" ")}
      >
        {selected ? (
          <Check className="text-brand-navy h-3.5 w-3.5" strokeWidth={3} />
        ) : null}
      </span>

      <span
        className={`flex-1 text-sm leading-relaxed sm:text-base ${
          selected ? "text-brand-navy font-semibold" : ""
        }`}
      >
        {label}
      </span>
    </button>
  );
}
