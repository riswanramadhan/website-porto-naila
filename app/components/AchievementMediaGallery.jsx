"use client";

import { Lightbox } from "./Lightbox";

export default function AchievementMediaGallery({ items = [], className = "" }) {
  if (!items.length) return null;

  return (
    <div className={`achievement-media-grid ${className}`.trim()}>
      {items.map((item, index) => {
        if (!item?.src) return null;
        const caption = item?.caption || item?.alt || "";
        const figureClassName = ["achievement-media", caption ? "has-caption" : ""].filter(Boolean).join(" ");

        return (
          <figure className={figureClassName} key={`${item?.src ?? "media"}-${index}`}>
            <Lightbox src={item?.src} alt={item?.alt || caption} caption={caption}>
              <img src={item?.src} alt={item?.alt || "Achievement media"} loading="lazy" />
            </Lightbox>
            {caption ? <figcaption className="achievement-media-caption">{caption}</figcaption> : null}
          </figure>
        );
      })}
    </div>
  );
}
