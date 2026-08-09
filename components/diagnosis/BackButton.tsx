"use client";

/**
 * 前の質問へ戻るボタン
 *
 * 出典: docs/01_diagnosis-spec.md §12, §18 / docs/08_web-spec.md §48
 *
 * 回答カードより目立たせない。
 */

import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  onClick: () => void;
};

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-note text-brand-black/45 hover:text-brand-navy flex min-h-12 items-center gap-2 self-start pr-3 transition-colors"
    >
      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
      前の質問
    </button>
  );
}
