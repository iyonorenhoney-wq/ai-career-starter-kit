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

const SITE_NAME = "AI CAREER STARTER KIT";
const TITLE = "AI仕事診断｜あなたに合うAI活用方法を10問で診断";
const DESCRIPTION =
  "仕事効率化・制作・副業・商品化・仕組み化。10個の質問から、あなたに合うAI仕事スタイルと次の一歩を整理します。";

/**
 * 出典: docs/08_web-spec.md §120-122 / docs/09_lp.md §65-68
 *
 * OGP画像はまだ用意していないため、画像の指定は入れていない。
 * 画像ができたら openGraph.images / twitter.images を追加するだけで有効になる。
 * 本番URLが決まったら metadataBase も設定する（08 §126）。
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  /* ブランドのBLACK（08 §14） */
  themeColor: "#070A0F",
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
