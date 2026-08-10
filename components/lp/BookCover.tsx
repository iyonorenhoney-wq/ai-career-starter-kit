/**
 * 攻略BOOKのイメージ枠
 *
 * 出典: docs/09_lp.md §29-30
 *
 * PDFはまだ完成していないため、実物に見える偽のモックアップは作らない。
 * ここでは「表紙の枠とタイトル」までにとどめる。
 *
 * 将来、実際のPDF表紙画像ができたら imageSrc を渡すだけで差し替えられる。
 */

import Image from "next/image";
import { careerBook } from "@/data/lpContent";

type BookCoverProps = {
  /** 表紙画像のパス。未設定なら文字だけの表紙を描画する */
  imageSrc?: string;
};

export function BookCover({ imageSrc }: BookCoverProps) {
  return (
    // 背面の装飾が 8px はみ出すため、その分だけ右に余白を確保しておく。
    // 余白がないと、狭い画面で親要素に横スクロールが発生する。
    <div className="mx-auto w-full max-w-[288px] pr-2">
      <div className="relative">
        {/* 本の厚みを感じさせる背面。装飾はこれだけにとどめる */}
        <div
          aria-hidden="true"
          className="bg-brand-navy/10 absolute inset-y-3 -right-2 left-2 rounded-r-card"
        />

        <div className="bg-card-glow relative aspect-[210/297] overflow-hidden rounded-card">
          {imageSrc !== undefined ? (
            <Image
              src={imageSrc}
              alt="AIキャリア攻略BOOKの表紙"
              fill
              sizes="280px"
              className="object-cover"
            />
          ) : (
            <>
              {/* ごく薄いグリッド。結果カードと同じ世界観にそろえる */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #4BD6D6 1px, transparent 1px), linear-gradient(to bottom, #4BD6D6 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-brand-turquoise/60"
              />

              <div className="relative flex h-full flex-col justify-between p-7 text-brand-white">
                <p className="eyebrow text-brand-turquoise text-[10px]">
                  AI Career Starter Kit
                </p>

                <div>
                  <p className="text-lg leading-snug font-bold whitespace-pre-line">
                    {careerBook.title}
                  </p>
                  <p className="text-brand-white/55 mt-3 text-xs">
                    {careerBook.subtitle}
                  </p>
                </div>

                <p className="text-brand-white/35 text-[10px]">by MOMOKA</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
