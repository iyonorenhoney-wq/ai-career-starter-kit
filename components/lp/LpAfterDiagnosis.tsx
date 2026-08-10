/**
 * AFTER DIAGNOSIS
 *
 * 出典: docs/09_lp.md §24-25
 *
 * 「診断して終わりではない」ことを、診断 → 攻略BOOK → 7日 → 30日 → 90日
 * という1本の流れとして見せる。
 *
 * ダークセクション。LP全体のリズムの中で、ここが転換点になる。
 */

import { afterDiagnosisCopy, journey } from "@/data/lpContent";

/** 2桁ゼロ埋め */
const pad2 = (value: number): string => String(value).padStart(2, "0");

export function LpAfterDiagnosis() {
  return (
    <section className="bg-dark-gradient py-20 text-brand-white sm:py-28">
      <div className="mx-auto w-full max-w-[880px] px-6">
        <h2 className="text-h3 leading-snug font-bold">
          診断して終わり、
          <br className="sm:hidden" />
          ではありません。
        </h2>

        <p className="text-brand-white/70 mt-6 max-w-[42rem] text-sm leading-loose">
          {afterDiagnosisCopy}
        </p>

        {/* 縦につながる1本の流れ。矢印だらけにせず、線と点で示す */}
        <ol className="mt-12 flex flex-col">
          {journey.map((step, index) => (
            <li key={step.label} className="flex gap-5">
              <div className="flex flex-col items-center">
                <span
                  aria-hidden="true"
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-badge ${
                    index === 0 ? "bg-brand-turquoise" : "bg-brand-white/30"
                  }`}
                />
                {index < journey.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="w-px flex-1 bg-brand-white/15"
                  />
                ) : null}
              </div>

              <div className="flex flex-1 flex-wrap items-baseline gap-x-4 gap-y-1 pb-8">
                <span
                  aria-hidden="true"
                  className="label-en text-brand-white/30 text-[10px]"
                >
                  {pad2(index + 1)}
                </span>
                <span className="text-base font-bold">{step.label}</span>
                <span className="text-brand-white/45 text-xs">
                  {step.note}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
