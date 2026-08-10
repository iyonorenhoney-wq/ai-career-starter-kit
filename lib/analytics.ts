/**
 * AI仕事診断｜計測イベント
 *
 * 出典: docs/08_web-spec.md §116-119 / docs/09_lp.md §69-70
 *
 * 現時点では何も送信しない（no-op）。
 * GA4 / Vercel Analytics 等が決まったら、このファイルの
 * `track` の中身だけを差し替えれば全イベントが有効になる。
 *
 * 個人情報は送信しない（08 §117）。
 */

/** LP内でCTAが置かれている位置。どのCTAから診断が始まったかを見るために使う */
export type CtaPosition = "hero" | "middle" | "final";

/** 計測イベント名（08 §116 / 09 §69） */
export type AnalyticsEvent =
  | { readonly name: "lp_view" }
  | { readonly name: "lp_cta_click"; readonly position: CtaPosition }
  | { readonly name: "diagnosis_view" }
  | { readonly name: "diagnosis_start" }
  | { readonly name: "question_answer"; readonly questionId: string }
  | {
      readonly name: "diagnosis_complete";
      readonly mainType: string;
      readonly subType: string;
      readonly goal: string;
      readonly style: string;
      readonly routeId: string;
    }
  | { readonly name: "line_cta_click" }
  | { readonly name: "diagnosis_restart" };

/**
 * イベントを送信する。
 *
 * Ver.1では送信先が未定のため何もしない。
 * 呼び出し側は導入済みの前提で書いておき、後から中身だけ差し替える。
 */
export function track(event: AnalyticsEvent): void {
  // 計測ツール導入時にここを実装する。
  // 例: window.gtag?.("event", event.name, { ...event });
  void event;
}
