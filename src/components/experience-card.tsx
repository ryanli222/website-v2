import Image from "next/image";

interface ExperienceCardProps {
  role: string;
  company: string;
  description: string;
  image?: string;
  delay: string;
}

export function ExperienceCard({ role, company, description, image, delay }: ExperienceCardProps) {
  return (
    <div className={`animate-fade-in ${delay} card overflow-hidden group`}>
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[13px] text-[#999]"
            style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
          >
            Experience · {company}
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
        <h3
          className="text-[20px] font-medium text-[#1a1a1a] mb-2"
          style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
        >
          {role}
        </h3>
        <p
          className="text-[15px] text-[#999] leading-relaxed"
          style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
        >
          {description}
        </p>
      </div>
      {image && (
        <div className="overflow-hidden">
          <Image
            src={image}
            alt={role}
            width={650}
            height={416}
            className="w-full h-auto -mt-[15%] transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.05]"
          />
        </div>
      )}
    </div>
  );
}
