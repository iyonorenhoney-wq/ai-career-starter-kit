/**
 * CAREER BOOK
 *
 * 出典: docs/09_lp.md §26-33
 *
 * 攻略BOOKの中身と、その中心にある7日チャレンジを見せる。
 * PDFが未完成のため、表紙は BookCover の枠のみ（実物風の偽画像は作らない）。
 */

import { BookCover } from "@/components/lp/BookCover";
import { careerBook, challenge } from "@/data/lpContent";

export function LpCareerBook() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[880px] px-6">
        <div className="grid items-start gap-12 sm:grid-cols-[280px_1fr] sm:gap-14">
          {/* 表紙イメージ。実際のPDFができたら imageSrc を渡すだけで差し替わる */}
          <BookCover />

          <div className="flex flex-col">
            <p className="eyebrow text-brand-turquoise">Your Career Book</p>
            <h2 className="text-h3 mt-5 leading-snug font-bold">
              診断結果に合った、
              <br />
              あなた専用の攻略BOOK。
            </h2>
            <p className="text-brand-black/65 mt-5 text-sm leading-loose">
              {careerBook.description}
            </p>

            <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-3">
              {careerBook.contents.map((content) => (
                <li
                  key={content}
                  className="text-brand-black/80 flex items-start gap-2.5 text-sm leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="bg-brand-turquoise mt-2 h-1 w-1 shrink-0 rounded-badge"
                  />
                  {content}
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-brand-border pt-6">
              <p className="eyebrow text-brand-black/35">さらに</p>
              <p className="text-brand-black/70 mt-3 text-sm leading-relaxed">
                {careerBook.bonuses.join(" ／ ")}
              </p>
            </div>
          </div>
        </div>

        {/* --- 7日チャレンジ --- */}
        <div className="bg-brand-off-white mt-16 rounded-card px-7 py-9 sm:px-10 sm:py-11">
          <h3 className="text-xl leading-snug font-bold sm:text-2xl">
            7日間、一緒に動く。
          </h3>
          <p className="text-brand-black/65 mt-4 max-w-[40rem] text-sm leading-loose">
            {challenge.copy}
          </p>

          <ol className="mt-8 grid gap-x-6 sm:grid-cols-2">
            {challenge.days.map((day, index) => (
              <li
                key={day}
                className="flex items-baseline gap-4 border-t border-brand-border py-3.5"
              >
                <span
                  aria-hidden="true"
                  className="label-en text-brand-turquoise w-12 shrink-0 text-[11px] font-bold"
                >
                  Day {index + 1}
                </span>
                <span className="text-sm">{day}</span>
              </li>
            ))}
          </ol>

          <p className="text-brand-black/40 mt-6 text-xs">{challenge.note}</p>
        </div>
      </div>
    </section>
  );
}
