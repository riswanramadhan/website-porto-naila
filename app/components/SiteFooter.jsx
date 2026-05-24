import Link from "next/link";

export default function SiteFooter({ backTopHref = "/#home" }) {
  const isHashLink = backTopHref.startsWith("#");
  const label = "Back to top";

  return (
    <>
      <footer className="footer">
        <div className="container footer-inner">
          <p>Naila Azahra (c) 2026</p>
        </div>
      </footer>
      {isHashLink ? (
        <a className="back-top-fab" href={backTopHref} aria-label={label}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5 5 12l1.4 1.4L11 8.8V20h2V8.8l4.6 4.6L19 12 12 5Z" />
          </svg>
        </a>
      ) : (
        <Link className="back-top-fab" href={backTopHref} aria-label={label}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5 5 12l1.4 1.4L11 8.8V20h2V8.8l4.6 4.6L19 12 12 5Z" />
          </svg>
        </Link>
      )}
    </>
  );
}
