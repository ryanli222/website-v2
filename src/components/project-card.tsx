import Image from "next/image";

interface ProjectCardProps {
  title: string;
  category: string;
  image?: string;
  delay: string;
  href?: string;
}

export function ProjectCard({
  title,
  category,
  image,
  delay,
  href = "#",
}: ProjectCardProps) {
  return (
    <a
      href={href}
      className={`animate-fade-in ${delay} card block group`}
    >
      {/* Label row */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <span
          className="text-[13px] text-[#999]"
          style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
        >
          {category} · {title}
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

      {/* Content area - no inner bg, card itself darkens on hover */}
      <div className="flex items-center justify-center h-[300px] overflow-hidden px-6 pb-5">
        {image ? (
          <div className="relative w-full h-full transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.05]">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain drop-shadow-lg"
            />
          </div>
        ) : (
          <div
            className="w-[75%] h-[80%] bg-white rounded-md flex items-center justify-center transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.05]"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <span
              className="text-[13px] text-[#ccc] font-medium"
              style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
            >
              {title}
            </span>
          </div>
        )}
      </div>
    </a>
  );
}
