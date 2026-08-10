"use client";

/**
 * LPのCTAボタン
 *
 * 出典: docs/09_lp.md §3, §42-44
 *
 * LP内のCTAはすべて同じ文言・同じ遷移先にする。
 * どのCTAから診断が始まったかを見るため、位置を計測イベントへ渡す（同 §70）。
 */

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CTA_LABEL, CTA_META } from "@/data/lpContent";
import { track, type CtaPosition } from "@/lib/analytics";

type LpCtaButtonProps = {
  /** LP内での位置。計測でCTAを区別するために使う */
  position: CtaPosition;
  /** ダーク背景の上に置くか */
  tone?: "light" | "dark";
  /** 補足（全10問｜約2分｜無料）を出すか */
  showMeta?: boolean;
};

export function LpCtaButton({
  position,
  tone = "light",
  showMeta = true,
}: LpCtaButtonProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Link
        href="/diagnosis"
        onClick={() => track({ name: "lp_cta_click", position })}
        className={[
          "group flex min-h-15 w-full items-center justify-center gap-3 rounded-btn px-7 text-center font-bold transition-colors",
          tone === "dark"
            ? "bg-brand-turquoise text-brand-navy hover:bg-brand-turquoise-light"
            : "bg-brand-navy text-brand-white hover:bg-brand-navy-light",
        ].join(" ")}
      >
        {CTA_LABEL}
        <ArrowRight
          className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>

      {showMeta ? (
        <p
          className={`text-xs ${
            tone === "dark" ? "text-brand-white/50" : "text-brand-black/45"
          }`}
        >
          {CTA_META.join(" ｜ ")}
        </p>
      ) : null}
    </div>
  );
}
