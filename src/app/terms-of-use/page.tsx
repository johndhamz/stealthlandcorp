import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { legal } from "@/data/content";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing the use of the Stealth Land Corporation website.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" image="/images/terms-of-use/terms-of-use.jpg" crumbs={[{ label: "Terms of Use" }]} compact />
      <section className="container-x max-w-3xl py-12 lg:py-16">
        <div className="prose-site">
          {legal.terms.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>
    </>
  );
}
