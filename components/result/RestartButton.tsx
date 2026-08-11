"use client";

/**
 * もう一度診断する
 *
 * 出典: docs/01_diagnosis-spec.md §51-52 / docs/08_web-spec.md §96
 *
 * 押しただけでは消さず、必ず確認をはさむ。
 * 「やり直す」を選んだときだけ保存データを削除して開始画面へ戻す。
 *
 * メインCTAより控えめな見た目にする（08 §142）。
 */

import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type RestartButtonProps = {
  onRestart: () => void;
};

export function RestartButton({ onRestart }: RestartButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  /** 開く前にフォーカスしていた要素。閉じたときにここへ戻す */
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // 閉じたら、開く前に操作していたボタンへフォーカスを戻す
      openerRef.current?.focus();
      openerRef.current = null;
      return;
    }

    openerRef.current = document.activeElement as HTMLElement | null;
    // 開いたら安全側（キャンセル）へフォーカスを移す
    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      // ダイアログの外へフォーカスが出ないよう、Tabを内側で循環させる
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      if (focusable === undefined || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (first === undefined || last === undefined) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-note text-brand-black/50 hover:text-brand-navy flex min-h-12 items-center gap-2 px-2 transition-colors"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        もう一度診断する
      </button>

      {/*
        モーダルは body 直下へ描画する。
        祖先に transform があると position: fixed の基準がその要素になり、
        画面中央ではない位置へ飛んでしまうため。
      */}
      {isOpen
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
              {/* 背景。クリックでキャンセル扱いにする */}
              <button
                type="button"
                aria-label="キャンセル"
                onClick={() => setIsOpen(false)}
                className="bg-brand-black/70 absolute inset-0"
              />

              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="restart-title"
                className="relative w-full max-w-[380px] rounded-card bg-brand-white px-7 py-8 shadow-soft"
              >
                <h2
                  id="restart-title"
                  className="text-base leading-relaxed font-bold"
                >
                  診断結果をリセットして
                  <br />
                  最初からやり直しますか？
                </h2>

                <p className="text-note text-brand-black/55 mt-3">
                  保存された回答と結果は削除されます。
                </p>

                <div className="mt-8 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onRestart();
                    }}
                    className="bg-brand-navy hover:bg-brand-navy-light min-h-13 w-full rounded-btn px-5 text-sm font-semibold text-brand-white transition-colors"
                  >
                    やり直す
                  </button>

                  <button
                    ref={cancelRef}
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="border-brand-border min-h-13 w-full rounded-btn border px-5 text-sm transition-colors hover:border-brand-navy"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
