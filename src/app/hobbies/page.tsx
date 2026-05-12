"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";

// Each block is manually placed on a 5-col grid for an irregular puzzle feel
const blocks = [
  { id: 1, label: "Ramen",     style: "col-start-1 col-end-4 row-start-1 row-end-3", dir: "left", image: "" },
  { id: 2, label: "Guitar",    style: "col-start-4 col-end-6 row-start-1 row-end-4", dir: "top", image: "" },
  { id: 3, label: "Sushi",     style: "col-start-1 col-end-3 row-start-3 row-end-5", dir: "bottom", image: "" },
  { id: 4, label: "Music",     style: "col-start-3 col-end-4 row-start-3 row-end-6", dir: "right", image: "" },
  { id: 5, label: "Coffee",    style: "col-start-4 col-end-6 row-start-4 row-end-6", dir: "left", image: "" },
  { id: 6, label: "Listening", style: "col-start-1 col-end-3 row-start-5 row-end-8", dir: "top", image: "" },
  { id: 7, label: "Pizza",     style: "col-start-3 col-end-6 row-start-6 row-end-8", dir: "right", image: "" },
  { id: 8, label: "Piano",     style: "col-start-1 col-end-4 row-start-8 row-end-10", dir: "bottom", image: "" },
  { id: 9, label: "Cooking",   style: "col-start-4 col-end-6 row-start-8 row-end-11", dir: "left", image: "" },
];

export default function HobbiesPage() {
  return (
    <div className="flex flex-col flex-1 items-center bg-white">
      <div className="w-full max-w-[1500px] px-8 md:px-12 lg:px-16 xl:px-20">
        <Header activeTab="hobbies" />

        <main className="pb-16">
          <div className="grid grid-cols-5 auto-rows-[80px] md:auto-rows-[100px] gap-3">
            {blocks.map((block, i) => (
              <div
                key={block.id}
                className={`${block.style} hobby-block hobby-slide-${block.dir} card group cursor-pointer rounded-lg relative overflow-hidden flex items-center justify-center select-none`}
                style={{ animationDelay: `${0.6 + i * 0.09}s` }}
              >
                {/* Photo */}
                {block.image && (
                  <Image
                    src={block.image}
                    alt={block.label}
                    fill
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                  />
                )}

                {/* Label in corner */}
                <span
                  className="absolute top-3 left-4 text-[13px] text-[#999] z-10"
                  style={{
                    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                  }}
                >
                  {block.label}
                </span>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
