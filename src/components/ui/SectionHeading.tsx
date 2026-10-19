import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}

export function SectionHeading({ eyebrow, title, description, align = "left", className, light }: Props) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2
        className={cn(
          "font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl",
          light ? "text-navy-900" : "text-white",
          align === "left" && "gold-line",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-5 text-base leading-relaxed", light ? "text-navy-700" : "text-white/70")}>{description}</p>
      )}
    </div>
  );
}
