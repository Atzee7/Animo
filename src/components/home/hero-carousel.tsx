"use client";

import { useState } from "react";
import type { FeaturedItem } from "@/lib/featured";
import { HeroSection } from "./hero-section";

interface HeroCarouselProps {
  items: FeaturedItem[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const current = items[index];

  if (!current) return null;

  const goPrev = () => {
    setIndex((currentIndex) =>
      currentIndex === 0 ? items.length - 1 : currentIndex - 1,
    );
  };

  const goNext = () => {
    setIndex((currentIndex) =>
      currentIndex === items.length - 1 ? 0 : currentIndex + 1,
    );
  };

  return (
    <HeroSection
      key={current.anime.id}
      anime={current.anime}
      episode={current.episode}
      badges={current.badges}
      index={index}
      count={items.length}
      onPrev={items.length > 1 ? goPrev : undefined}
      onNext={items.length > 1 ? goNext : undefined}
    />
  );
}
