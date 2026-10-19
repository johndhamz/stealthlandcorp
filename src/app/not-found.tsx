import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-white/65">The page you are looking for may have moved. Explore our properties or head back home.</p>
      <div className="mt-8 flex gap-3">
        <Button href="/properties">View properties</Button>
        <Link href="/" className="inline-flex items-center rounded-md border border-white/20 px-6 py-3 font-display text-xs font-semibold uppercase tracking-wide hover:border-gold-500 hover:text-gold-400">Home</Link>
      </div>
    </section>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
