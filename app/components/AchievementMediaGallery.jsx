"use client";

import { Lightbox } from "./Lightbox";
import Image from "next/image";
import { optimizedImageProps } from "@/lib/image";

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
              <Image
                src={item.src}
                alt={item.alt || "Achievement media"}
                fill
                sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 960px) 50vw, 33vw"
                {...optimizedImageProps}
              />
            </Lightbox>
            {caption ? <figcaption className="achievement-media-caption">{caption}</figcaption> : null}
          </figure>
        );
      })}
    </div>
  );
}
