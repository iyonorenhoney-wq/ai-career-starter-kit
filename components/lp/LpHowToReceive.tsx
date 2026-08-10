/**
 * HOW TO RECEIVE
 *
 * 出典: docs/09_lp.md §34-35 / docs/01_diagnosis-spec.md §44-45
 *
 * ここで初めてLINE導線を詳しく説明する。
 * LP前半で説明すると、診断より先にLINE登録の話になってしまうため。
 */

import { changeExamples, receiveSteps } from "@/data/lpContent";

/** 2桁ゼロ埋め */
const pad2 = (value: number): string => String(value).padStart(2, "0");

export function LpHowToReceive() {
  return (
    <section className="bg-brand-off-white py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[880px] px-6">
        <p className="eyebrow text-brand-turquoise">How To Receive</p>
        <h2 className="text-h3 mt-5 font-bold">専用攻略BOOKの受け取り方</h2>

        <ol className="mt-10 flex flex-col">
          {receiveSteps.map((step, index) => (
            <li key={step.title} className="flex gap-5">
              <div className="flex flex-col items-center">
                <span className="label-en text-brand-turquoise mt-0.5 text-xs font-bold">
                  {pad2(index + 1)}
                </span>
                {index < receiveSteps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="bg-brand-border mt-2 w-px flex-1"
                  />
                ) : null}
              </div>

              <div className="flex-1 pb-8">
                <h3 className="text-base font-bold">{step.title}</h3>
                <p className="text-brand-black/60 mt-1.5 text-sm leading-relaxed">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* 「今一番変えたいこと」のハードルを下げる（09 §35） */}
        <div className="border-brand-turquoise mt-2 border-l-2 pl-5">
          <p className="text-brand-black/70 text-sm leading-loose">
            「今一番変えたいこと」は長文でなくて大丈夫です。
          </p>
          <p className="text-brand-black/50 mt-2 text-sm">
            例：{changeExamples.join(" ／ ")}
          </p>
        </div>
      </div>
    </section>
  );
}
