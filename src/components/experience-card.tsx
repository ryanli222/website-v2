import Image from "next/image";
import Link from "next/link";

interface ExperienceCardProps {
  role: string;
  company: string;
  image?: string;
  delay: string;
  href?: string;
}

export function ExperienceCard({ role, company, image, delay, href }: ExperienceCardProps) {
  const isExternal =
    href?.startsWith("http://") || href?.startsWith("https://");

  const inner = (
    <div className="flex items-center gap-4 px-5 py-4">
      {image && (
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
          <Image
            src={image}
            alt={company}
            fill
            sizes="56px"
            className="object-contain transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.08]"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <span className="text-[13px] text-[#767676]">Experience · {company}</span>
        <h3 className="truncate text-[18px] font-medium text-[#1a1a1a]">{role}</h3>
      </div>
      <div className="card-arrow shrink-0">
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
  );

  const className = `animate-fade-in ${delay} card overflow-hidden group block`;

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}
