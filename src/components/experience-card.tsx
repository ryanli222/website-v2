interface ExperienceCardProps {
  role: string;
  company: string;
  description: string;
  delay: string;
}

export function ExperienceCard({ role, company, description, delay }: ExperienceCardProps) {
  return (
    <div className={`animate-fade-in ${delay} card px-5 py-4`}>
      <div className="flex items-center justify-between mb-1">
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
        className="text-[15px] font-medium text-[#1a1a1a] mb-1"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        {role}
      </h3>
      <p
        className="text-[13px] text-[#999] leading-relaxed"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        {description}
      </p>
    </div>
  );
}
