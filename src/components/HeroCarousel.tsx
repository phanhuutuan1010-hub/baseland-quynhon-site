"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

export type HeroSlide = { src: string; alt: string } | { placeholder: string };

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((s) => (s + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 z-0">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 h-full w-full transition-opacity duration-[900ms] ease-in-out"
          style={{ opacity: active === i ? 1 : 0 }}
        >
          {"src" in slide ? (
            <Image src={slide.src} alt={slide.alt} fill sizes="100vw" priority={i === 0} className="object-cover" />
          ) : (
            <ImagePlaceholder label={slide.placeholder} tone="dark" className="rounded-none border-none" />
          )}
        </div>
      ))}
      <div className="absolute right-5 bottom-6 z-[3] flex gap-2 sm:right-10 md:right-16">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
            className="h-2 w-2 cursor-pointer rounded-full border-none p-0 transition-all duration-300"
            style={{
              background: active === i ? "var(--color-warm-white)" : "rgba(250,245,238,0.45)",
              transform: active === i ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
