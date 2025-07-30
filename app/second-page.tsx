import React from "react";
import Link from "next/link";

export const dynamic = "force-static";

export default function SecondPage() {
  return (
    <main className='min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50 px-4'>
      <Link
        href='/'
        className='absolute top-8 left-8 text-rose-700 font-premium text-lg hover:underline'
      >
        ← Home
      </Link>
      <div className='max-w-2xl text-center py-24'>
        <h1 className='text-5xl md:text-6xl font-premium text-rose-900 mb-8'>
          WE LIVE YOUR CELEBRATION
        </h1>
        <p className='text-xl md:text-2xl text-slate-700 font-heading mb-8'>
          At Weeding Troop, we do more than document your wedding—we immerse
          ourselves in your story. Every fleeting glance, every heartfelt laugh,
          every tear of joy is a moment we cherish alongside you. Our passion is
          to capture the essence of your day, not just as observers, but as
          companions on your journey.
        </p>
        <p className='text-lg text-slate-500 font-heading'>
          We are not just photographers and filmmakers. We are storytellers,
          memory weavers, and keepers of emotion. With artistry and empathy, we
          preserve your most genuine moments, so you can relive them for a
          lifetime.
        </p>
      </div>
    </main>
  );
}
