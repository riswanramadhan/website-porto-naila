"use client";

import Image from "next/image";
import { ArrowUpRight, MoveHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { optimizedImageProps } from "@/lib/image";

const getMediaStyle = (image = {}) => {
  const clamp = (value, fallback) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(100, Math.max(0, number)) : fallback;
  };

  return {
    "--media-focus-x": `${clamp(image.focus?.x, 50)}%`,
    "--media-focus-y": `${clamp(image.focus?.y, 50)}%`,
  };
};

export default function NewsCarousel({ articles = [] }) {
  const gridRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !articles.length) return undefined;

    const cards = Array.from(grid.querySelectorAll(".news-card"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        setActiveIndex(cards.indexOf(visible.target));
      },
      { root: grid, threshold: [0.55, 0.75, 0.95] }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [articles.length]);

  const goTo = (index) => {
    const grid = gridRef.current;
    const card = grid?.querySelectorAll(".news-card")[index];
    if (!grid || !card) return;
    grid.scrollTo({ left: card.offsetLeft - grid.offsetLeft, behavior: "auto" });
  };

  return (
    <>
      <div className="news-swipe-hint" aria-hidden="true">
        <MoveHorizontal />
        <span data-i18n="newsSwipeHint">Swipe to see more</span>
      </div>
      <div className="news-grid" ref={gridRef}>
        {articles.map((article) => {
          const imageSrc = article.image?.cardSrc || article.image?.src;
          return (
            <a
              className="news-card"
              href={article.href}
              key={article.id ?? article.href}
              target="_blank"
              rel="noreferrer"
            >
              {imageSrc ? (
                <div className="news-photo" style={getMediaStyle(article.image)}>
                  <Image
                    src={imageSrc}
                    alt={article.image.alt || article.title}
                    fill
                    sizes="(max-width: 640px) 82vw, (max-width: 960px) 50vw, 25vw"
                    {...optimizedImageProps}
                  />
                  <span className="news-open-indicator" aria-hidden="true">
                    <ArrowUpRight />
                    <span data-i18n="newsVisit">Visit</span>
                  </span>
                </div>
              ) : null}
              <div className="news-copy">
                <span className="news-source">{article.source}</span>
                <h3>{article.title}</h3>
                <p className="news-summary">{article.summary}</p>
              </div>
            </a>
          );
        })}
      </div>
      <div className="news-carousel-dots" aria-label="News position">
        {articles.map((article, index) => (
          <button
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            aria-label={`Show news ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => goTo(index)}
            key={article.id ?? article.href ?? index}
          />
        ))}
      </div>
    </>
  );
}
