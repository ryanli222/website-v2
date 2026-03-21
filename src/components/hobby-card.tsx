import Image from "next/image";

interface HobbyCardProps {
  title: string;
  image?: string;
  emoji?: string;
  delay: string;
}

export function HobbyCard({ title, image, emoji, delay }: HobbyCardProps) {
  return (
    <div className={`animate-fade-in ${delay} card group aspect-square relative overflow-hidden`}>
      {/* Title row */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-2">
        <span
          className="text-[13px] text-[#999]"
          style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
        >
          Hobbies · {title}
        </span>
        <div className="card-arrow">
          <svg
            className="w-3 h-3 text-[#bbb]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>

      {/* Image fills most of the card, offset down slightly to reveal title */}
      {image ? (
        <div className="absolute inset-0 top-[44px] transition-[top] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:top-0 z-20">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1 h-[calc(100%-44px)]">
          <span className="text-5xl select-none transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.15]">
            {emoji}
          </span>
        </div>
      )}
    </div>
  );
}
