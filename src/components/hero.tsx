"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const TEXT = "hey, im ryan";
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function Hero() {
  const [len, setLen] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const later = (fn: () => void, ms: number) => (timer = setTimeout(fn, ms));

    const type = (n: number) => {
      setLen(n);
      if (n < TEXT.length) {
        // occasional hesitation, otherwise human-ish jitter
        later(() => type(n + 1), Math.random() < 0.15 ? rand(250, 500) : rand(60, 170));
      } else {
        // ponytail: pause, wipe a random tail (sometimes everything), retype
        const stopAt = Math.random() < 0.4 ? 0 : Math.floor(rand(1, TEXT.length - 2));
        later(() => erase(n, stopAt), rand(1800, 3500));
      }
    };

    const erase = (n: number, stopAt: number) => {
      setLen(n);
      if (n > stopAt) later(() => erase(n - 1, stopAt), rand(40, 90));
      else later(() => type(n), rand(300, 700));
    };

    later(() => type(0), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="animate-hero-fade pb-4 max-w-[560px]">
      <p className="text-[44px] md:text-[56px] leading-[1.2] text-[#1a1a1a] font-light min-h-[1.2em]">
        {TEXT.slice(0, len)}
        <span className="hero-caret" aria-hidden />
      </p>
      <p className="text-[28px] md:text-[32px] leading-[1.45] text-[#737373] font-light">
        full stack robotics engineer
      </p>
      <p className="flex items-center gap-2 text-[28px] md:text-[32px] leading-[1.45] text-[#737373] font-light">
        tron @uwaterloo
        <Image src="/logos/uwaterloo.svg" alt="University of Waterloo" width={28} height={32} className="h-[0.95em] w-auto" />
      </p>
    </section>
  );
}
