/**
 * STEP2 時点の仮ページ。
 *
 * ここは最終的に LP（docs/09_lp.md の全11セクション）へ差し替える。
 * 現時点では「土台とブランドトークンが正しく動いているか」を目視確認するための
 * 内容にとどめ、デザインの作り込みは行わない。
 */

/** 確認用のカラースウォッチ定義 */
const SWATCHES = [
  { name: "BLACK", hex: "#070A0F", className: "bg-brand-black" },
  { name: "NAVY", hex: "#0B1D33", className: "bg-brand-navy" },
  { name: "NAVY LIGHT", hex: "#153A5B", className: "bg-brand-navy-light" },
  { name: "WHITE", hex: "#FFFFFF", className: "bg-brand-white" },
  { name: "OFF WHITE", hex: "#F7F9FC", className: "bg-brand-off-white" },
  { name: "TURQUOISE", hex: "#4BD6D6", className: "bg-brand-turquoise" },
  {
    name: "TURQUOISE LIGHT",
    hex: "#7BE8E8",
    className: "bg-brand-turquoise-light",
  },
  { name: "ACCENT BLUE", hex: "#1F6FB2", className: "bg-brand-accent-blue" },
] as const;

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[720px] flex-col justify-center gap-12 px-6 py-20">
      <header className="flex flex-col gap-3">
        <p className="label-en text-brand-accent-blue text-sm">
          AI Career Starter Kit
        </p>
        <h1 className="text-h2 font-bold">セットアップ完了</h1>
        <p className="text-brand-black/70">
          STEP2（型定義）まで完了しています。
          <br />
          診断機能・LP はこの後の STEP で実装します。
        </p>
      </header>

      {/* ブランドトークンが正しく読み込まれているかの確認用 */}
      <section className="flex flex-col gap-4">
        <h2 className="label-en text-brand-black/50 text-xs">Brand Colors</h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SWATCHES.map((swatch) => (
            <li key={swatch.name} className="flex flex-col gap-2">
              <div
                className={`border-brand-border h-16 rounded-card border ${swatch.className}`}
              />
              <div className="flex flex-col">
                <span className="label-en text-brand-black text-[11px]">
                  {swatch.name}
                </span>
                <span className="label-en text-brand-black/45 text-[10px]">
                  {swatch.hex}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* グラデーション確認 */}
      <section className="flex flex-col gap-4">
        <h2 className="label-en text-brand-black/50 text-xs">Gradients</h2>
        <div className="bg-brand-gradient h-3 rounded-badge" />
        <div className="bg-card-glow flex h-32 items-center justify-center rounded-card">
          <p className="label-en text-brand-white text-sm">
            Result Card Surface
          </p>
        </div>
      </section>
    </main>
  );
}
