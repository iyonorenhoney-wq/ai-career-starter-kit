/**
 * フッター
 *
 * 販売導線は置かない。Ver.1では最低限の表記だけにする。
 */

export function Footer() {
  return (
    <footer className="bg-brand-black py-10">
      <div className="mx-auto w-full max-w-[1080px] px-6">
        <p className="eyebrow text-brand-white/30 text-[10px]">
          AI Career Starter Kit
        </p>
        <p className="text-brand-white/25 mt-2 text-xs">by MOMOKA</p>
      </div>
    </footer>
  );
}
