"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { optimizedImageProps } from "@/lib/image";

export function Lightbox({ src, alt, caption, children }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!src) return null;

  const overlay = open ? (
    <div className="lightbox-overlay" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
      <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
        <Image
          className="lightbox-img"
          src={src}
          alt={alt || "Achievement media"}
          width={1800}
          height={1350}
          sizes="95vw"
          {...optimizedImageProps}
        />
        {caption ? <figcaption className="lightbox-caption">{caption}</figcaption> : null}
      </figure>
      <button className="lightbox-close" type="button" onClick={() => setOpen(false)} aria-label="Close">
        <X aria-hidden="true" />
      </button>
    </div>
  ) : null;

  return (
    <>
      <button
        className="lightbox-trigger"
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt ? `View ${alt}` : "View image"}
      >
        {children}
      </button>
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
