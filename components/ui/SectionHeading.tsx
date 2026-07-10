interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** "dark" para usar sobre fondos oscuros (ej. secciones con bg-deep-900). */
  tone?: "light" | "dark";
}

export function SectionHeading({ eyebrow, title, description, align = "center", tone = "light" }: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";
  const titleColor = tone === "dark" ? "text-white" : "text-deep-900";
  const descriptionColor = tone === "dark" ? "text-white/65" : "text-deep-700/70";
  const eyebrowColor = tone === "dark" ? "text-dorado-200" : "text-dorado-600";

  return (
    <div className={`flex flex-col gap-3 max-w-2xl ${alignment}`}>
      {eyebrow && (
        <span className={`text-xs font-bold uppercase tracking-widest ${eyebrowColor}`}>{eyebrow}</span>
      )}
      <h2 className={`font-display text-2xl sm:text-3xl font-bold text-balance ${titleColor}`}>
        {title}
      </h2>
      {description && <p className={`text-sm sm:text-base text-pretty ${descriptionColor}`}>{description}</p>}
    </div>
  );
}
