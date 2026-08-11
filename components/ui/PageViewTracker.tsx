"use client";

/**
 * ページ表示の計測
 *
 * 出典: docs/08_web-spec.md §116, §119 / docs/09_lp.md §69, §71
 *
 * 画面には何も描画しない。表示回数を記録するためだけの部品。
 * 送信先が決まるまでは何も送らない（lib/analytics.ts が no-op のため）。
 */

import { useEffect, useRef } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type PageViewTrackerProps = {
  /** 送るイベント名 */
  event: Extract<AnalyticsEvent, { name: "lp_view" | "diagnosis_view" }>["name"];
};

export function PageViewTracker({ event }: PageViewTrackerProps) {
  // 開発時の二重実行や再描画で、同じ表示を重複して数えないようにする
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    track({ name: event });
  }, [event]);

  return null;
}
