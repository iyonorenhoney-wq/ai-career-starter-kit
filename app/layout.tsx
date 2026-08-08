import type { Metadata, Viewport } from "next";
import { Geist, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

/**
 * 英字用フォント。見出し・英字ラベル（MAIN TYPE 等）で使用する。
 * 出典: docs/08_web-spec.md §24
 */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

/**
 * 日本語用フォント。
 * 日本語フォントはファイル数が多いため preload を切り、
 * 初期表示を重くしない（docs/08_web-spec.md §113）。
 */
const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

/** 出典: docs/08_web-spec.md §120 / docs/09_lp.md §65-66 */
export const metadata: Metadata = {
  title: "AI仕事診断｜あなたに合うAI活用方法を10問で診断",
  description:
    "仕事効率化・制作・副業・商品化・仕組み化。10個の質問から、あなたに合うAI仕事スタイルと次の一歩を整理します。",
};

export const viewport: Viewport = {
  themeColor: "#080B10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geist.variable} ${notoSansJp.variable}`}>
        {children}
      </body>
    </html>
  );
}
