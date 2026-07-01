"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { optimizedImageProps } from "@/lib/image";

export default function ProjectCard({ project, summary, mediaStyle }) {
  const [flipped, setFlipped] = useState(false);
  const imageSrc = project.image?.cardSrc || project.image?.src;

  return (
    <article className={`case-card reveal ${flipped ? "is-flipped" : ""}`.trim()}>
      <div className="case-card-inner">
        <button
          className="case-card-face case-card-front project-flip-surface"
          type="button"
          aria-expanded={flipped}
          aria-label={`${project.title}: lihat deskripsi`}
          aria-hidden={flipped}
          tabIndex={flipped ? -1 : 0}
          onClick={() => setFlipped(true)}
        >
          <div className="case-topline">
            <h3>{project.title}</h3>
            {imageSrc ? (
              <span className="case-image-wrap" style={mediaStyle}>
                <Image
                  className="case-image"
                  src={imageSrc}
                  alt={project.image.alt || project.title}
                  fill
                  sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 960px) 50vw, 33vw"
                  {...optimizedImageProps}
                />
              </span>
            ) : null}
          </div>
          <p className="case-summary">{summary.preview}</p>
          <span className="project-readmore">
            <span data-i18n="projectReadMore">See more</span>
          </span>
        </button>

        <div className="case-card-face case-card-back" aria-hidden={!flipped}>
          <div className="case-back-header">
            <span className="case-back-label" data-i18n="projectDescription">
              Description
            </span>
            <h3>{project.title}</h3>
          </div>
          <div className="case-back-scroll">
            <p>{summary.full}</p>
          </div>
          <div className="case-back-actions">
            {project.href ? (
              <a
                className="project-website-link"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                tabIndex={flipped ? 0 : -1}
                aria-label={`Buka website ${project.title}`}
              >
                Website
                <ArrowUpRight aria-hidden="true" />
              </a>
            ) : null}
            <button
              className="project-readmore"
              type="button"
              aria-expanded={flipped}
              aria-label={`${project.title}: kembali ke tampilan depan`}
              tabIndex={flipped ? 0 : -1}
              onClick={() => setFlipped(false)}
            >
              <span data-i18n="projectReadLess">Back</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
