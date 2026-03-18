import Image from "next/image";

interface HobbyCardProps {
  title: string;
  image?: string;
  emoji?: string;
  delay: string;
}

export function HobbyCard({ title, image, emoji, delay }: HobbyCardProps) {
  return (
    <div className={`animate-fade-in ${delay} card group`}>
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
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
      <div className="flex items-center justify-center h-[140px] overflow-hidden px-4 pb-4">
        {image ? (
          <div className="relative w-full h-full transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.05]">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover rounded-md"
            />
          </div>
        ) : (
          <span className="text-5xl select-none transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.15]">
            {emoji}
          </span>
        )}
      </div>
    </div>
  );
}
