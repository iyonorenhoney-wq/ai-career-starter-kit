/**
 * FAQ ＋ この診断を作った人
 *
 * 出典: docs/09_lp.md §38, §40
 *
 * FAQは5問まで。長くしない。
 * 作った人の紹介は、大きなプロフィールにせず小さく添える。
 */

import { author, faqs } from "@/data/lpContent";

export function LpFaq() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[720px] px-6">
        <h2 className="text-h3 font-bold">よくある質問</h2>

        <dl className="mt-10 flex flex-col">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-t border-brand-border py-6">
              <dt className="flex items-baseline gap-3 text-sm font-bold sm:text-base">
                <span
                  aria-hidden="true"
                  className="label-en text-brand-turquoise text-xs"
                >
                  Q
                </span>
                {faq.question}
              </dt>
              <dd className="text-brand-black/65 mt-3 pl-6 text-sm leading-loose">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>

        {/* この診断を作った人。写真は使わず、文章も短く */}
        <div className="bg-brand-off-white mt-14 rounded-card px-7 py-8">
          <p className="eyebrow text-brand-black/35">この診断を作った人</p>
          <p className="label-en text-brand-navy mt-4 text-base font-bold">
            {author.name}
          </p>
          <p className="text-brand-black/70 mt-3 text-sm leading-loose">
            {author.body}
          </p>
        </div>
      </div>
    </section>
  );
}
