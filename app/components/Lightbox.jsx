"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
        <img className="lightbox-img" src={src} alt={alt || "Achievement media"} />
        {caption ? <figcaption className="lightbox-caption">{caption}</figcaption> : null}
      </figure>
      <button className="lightbox-close" type="button" onClick={() => setOpen(false)} aria-label="Close">
        ✕
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