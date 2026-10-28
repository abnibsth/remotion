"use client";

import { animate, motion, useInView, useMotionValue, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ILLUSTRATIVE_STATS, STORIES } from "@/lib/products";
import { Kicker, Reveal } from "@/components/reveal";

function ParallaxStoryImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-cream-50/15"
    >
      <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[10%]">
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      </motion.div>
    </motion.div>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration: 1.7, ease: "easeOut" });
    const unsub = mv.on("change", (v) =>
      setDisplay(Math.round(v).toLocaleString("id-ID")),
    );
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, value, mv]);

  return (
    <span ref={ref} className="text-4xl font-extrabold tracking-tight text-sun-400 md:text-5xl">
      {display}
      {suffix}
    </span>
  );
}

export default function StorySection() {
  return (
    <section id="cerita" className="scroll-mt-24 bg-forest-950 py-20 text-cream-50 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <Kicker light>Cerita UMKM</Kicker>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
            Di Balik Produk,{" "}
            <em className="font-display text-sun-400 italic">Ada Cerita.</em>
          </h2>
          <p className="mt-4 leading-relaxed text-cream-50/65">
            Setiap paket yang tiba di pintumu dimulai dari seseorang yang berani
            memulai. Inilah beberapa dari mereka.
          </p>
        </Reveal>

        <div className="mt-6">
          {STORIES.map((s, i) => (
            <div
              key={s.name}
              className="grid items-center gap-8 border-b border-cream-50/10 py-12 last:border-0 md:grid-cols-2 md:gap-16 md:py-16"
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <ParallaxStoryImage src={s.image} alt={`${s.name} — ${s.role}`} />
              </div>
              <Reveal className={i % 2 === 1 ? "md:order-1" : ""} delay={0.1}>
                <p className="text-xs font-bold tracking-[0.2em] text-sun-400 uppercase">
                  {s.productLine}
                </p>
                <blockquote className="mt-4 font-display text-2xl leading-snug italic md:text-[2.1rem]">
                  “{s.quote}”
                </blockquote>
                <p className="mt-5 font-extrabold">{s.name}</p>
                <p className="text-sm text-cream-50/55">{s.role}</p>
                <Link
                  href="/belanja"
                  className="group mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-sun-400"
                >
                  Lihat produk mereka
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="grid grid-cols-2 gap-8 rounded-[2rem] bg-forest-900/70 p-8 ring-1 ring-cream-50/10 md:grid-cols-4 md:p-12">
            {ILLUSTRATIVE_STATS.map((s) => (
              <div key={s.label}>
                <Counter value={s.value} suffix={s.suffix} />
                <p className="mt-1.5 text-sm font-semibold text-cream-50/60">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-right text-xs text-cream-50/35">
            *Angka bersifat ilustratif untuk demo, bukan data aktual.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
