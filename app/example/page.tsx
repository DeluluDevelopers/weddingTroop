import React from "react";
import Link from "next/link";

export const dynamic = "force-static";

export default function ThirdPage() {
  return (
    <main className='min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-rose-50 px-4'>
      <div className='absolute top-8 left-8 flex gap-4'>
        <Link
          href='/'
          className='text-rose-700 font-premium text-lg hover:underline'
        >
          ← Home
        </Link>

      </div>
      <div className='max-w-2xl text-center py-24'>
        <h1 className='text-5xl md:text-6xl font-premium text-rose-900 mb-8'>
          YOUR STORY, BEAUTIFULLY TOLD
        </h1>
        <p className='text-xl md:text-2xl text-slate-700 font-heading mb-8'>
          Every couple is unique, and so is every wedding. At Weeding Troop, we
          craft films and photographs that reflect your personality, your love,
          and your dreams. Our approach is personal, artistic, and deeply
          attentive to the details that matter most to you.
        </p>
        <p className='text-lg text-slate-500 font-heading'>
          Let us be the keepers of your memories, capturing the laughter, the
          tears, and the magic of your day with timeless elegance. Your story
          deserves to be told with heart—and we are honored to tell it.
        </p>
      </div>
    </main>
  );
}
