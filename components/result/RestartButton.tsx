"use client";

/**
 * もう一度診断する
 *
 * 出典: docs/01_diagnosis-spec.md §51-52 / docs/08_web-spec.md §96
 *
 * 押しただけでは消さず、必ず確認をはさむ。
 * 「やり直す」を選んだときだけ保存データを削除して開始画面へ戻す。
 */

import { useEffect, useRef, useState } from "react";

type RestartButtonProps = {
  onRestart: () => void;
};

export function RestartButton({ onRestart }: RestartButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // 開いたら安全側（キャンセル）へフォーカスを移し、Escapeで閉じられるようにする
  useEffect(() => {
    if (!isOpen) return;

    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="min-h-12 rounded-btn border border-brand-border px-6 text-sm text-brand-black/70 transition-colors hover:border-brand-navy hover:text-brand-black"
      >
        もう一度診断する
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          {/* 背景。クリックでキャンセル扱いにする */}
          <button
            type="button"
            aria-label="キャンセル"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-brand-black/60"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="restart-title"
            className="relative w-full max-w-[400px] rounded-card bg-brand-white p-6 shadow-soft"
          >
            <h2 id="restart-title" className="text-base leading-relaxed font-bold">
              診断結果をリセットして
              <br />
              最初からやり直しますか？
            </h2>

            <p className="mt-3 text-sm text-brand-black/60">
              保存された回答と結果は削除されます。
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onRestart();
                }}
                className="bg-brand-navy min-h-12 flex-1 rounded-btn px-5 text-sm font-semibold text-brand-white"
              >
                やり直す
              </button>

              <button
                ref={cancelRef}
                type="button"
                onClick={() => setIsOpen(false)}
                className="min-h-12 flex-1 rounded-btn border border-brand-border px-5 text-sm"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
