/**
 * PROBLEM
 *
 * 出典: docs/09_lp.md §12-13
 *
 * 悩みを4つ並べて、締めのコピーで診断へつなぐ。ここは長くしない。
 * カードを並べるのではなく、罫線で区切った一覧にして重さを出さない。
 */

import { problemClosing, problems } from "@/data/lpContent";

export function LpProblem() {
  return (
    <section className="bg-brand-off-white py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[880px] px-6">
        <h2 className="text-h3 leading-snug font-bold">
          こんな状態で
          <br className="sm:hidden" />
          止まっていませんか？
        </h2>

        <ul className="mt-10 grid gap-x-10 sm:grid-cols-2">
          {problems.map((problem) => (
            <li
              key={problem}
              className="border-t border-brand-border py-6 text-sm leading-loose whitespace-pre-line"
            >
              {problem}
            </li>
          ))}
        </ul>

        <p className="border-brand-turquoise text-brand-black/80 mt-12 border-l-2 pl-5 text-sm leading-loose sm:text-base">
          {problemClosing}
        </p>
      </div>
    </section>
  );
}
