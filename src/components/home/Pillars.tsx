import { Leaf, Lightbulb, HeartHandshake } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const icons = [Leaf, Lightbulb, HeartHandshake];

export function Pillars({ items }: { items: ReadonlyArray<{ title: string; text: string }> }) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {items.map((item, i) => {
        const Icon = icons[i % icons.length];
        return (
          <Reveal key={item.title} delay={i * 100} className="group rounded-xl border border-white/8 bg-white/[0.03] p-6 transition hover:border-gold-500/40 hover:bg-white/[0.05]">
            <div className="mb-4 inline-flex rounded-lg bg-gold-500/10 p-2.5 text-gold-400 transition group-hover:bg-gold-500 group-hover:text-navy-900">
              <Icon className="size-5" />
            </div>
            <h3 className="font-display text-lg font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{item.text}</p>
          </Reveal>
        );
      })}
    </div>
  );
}
