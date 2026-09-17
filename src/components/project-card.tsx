import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  category: string;
  image?: string;
  imageStyle?: "contain" | "bottom" | "overflow" | "full";
  icon?: React.ReactNode;
  hoverScale?: number;
  priority?: boolean;
  delay: string;
  href?: string;
  onPointerEnter?: () => void;
  style?: React.CSSProperties;
}

export function ProjectCard({
  title,
  category,
  image,
  imageStyle = "contain",
  icon,
  hoverScale,
  priority = false,
  delay,
  href = "#",
  onPointerEnter,
  style,
}: ProjectCardProps) {
  return (
    <Link
      href={href}
      className={`animate-fade-in ${delay} card flex flex-col group`}
      onPointerEnter={onPointerEnter}
      style={style}
    >
      {/* Label row */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <span
          className="text-[13px] text-[#767676]"
          style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
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

      {/* Content area */}
      <div className={`flex grow items-end justify-center ${imageStyle === "full" ? "h-[350px]" : "h-[300px]"} ${imageStyle === "overflow" ? "overflow-visible" : "overflow-hidden"} ${imageStyle === "full" ? "px-0 pb-0" : imageStyle === "bottom" ? "px-4 pb-0" : imageStyle === "overflow" ? "px-6 pb-0" : "px-6 pb-5"}`}>
        {image ? (
          <div className={`card-image relative transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${imageStyle === "full" ? "h-full w-full" : imageStyle === "bottom" ? "h-[95%] w-full" : imageStyle === "overflow" ? "h-[110%] w-[70%] translate-y-[15%] group-hover:translate-y-[8%]" : "h-full w-full"}`} style={{ "--hover-scale": hoverScale ?? 1.05 } as React.CSSProperties}>
            <Image
              src={image}
              alt={title}
              fill
              priority={priority}
              sizes="(max-width: 639px) calc(100vw - 4rem), (max-width: 1023px) calc(50vw - 4rem), calc(33vw - 4rem)"
              className={`${imageStyle === "full" ? "object-cover" : "drop-shadow-lg"} ${imageStyle === "bottom" ? "object-contain object-bottom" : imageStyle === "overflow" ? "object-contain drop-shadow-xl" : imageStyle === "full" ? "" : "object-contain"}`}
            />
          </div>
        ) : icon ? (
          <div className="flex items-center justify-center h-full w-full transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.08]">
            {icon}
          </div>
        ) : (
          <div
            className="w-[75%] h-[80%] bg-white rounded-md flex items-center justify-center transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.05] mb-5"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <span
              className="text-[13px] text-[#ccc] font-medium"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              {title}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
