"use client";

/**
 * 前の質問へ戻るボタン
 *
 * 出典: docs/01_diagnosis-spec.md §12, §18 / docs/08_web-spec.md §48
 *
 * 回答カードより目立たせない。
 */

type BackButtonProps = {
  onClick: () => void;
};

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-12 self-start px-2 text-sm text-brand-black/55 transition-colors hover:text-brand-black"
    >
      ← 前の質問
    </button>
  );
}
