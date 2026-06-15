export default function Loading() {
  return (
    <main className="page-skeleton" aria-label="Loading page">
      <section className="section">
        <div className="container page-skeleton-grid">
          <div className="page-skeleton-copy">
            <span className="skeleton-line skeleton-line-short"></span>
            <span className="skeleton-line skeleton-title-line"></span>
            <span className="skeleton-line skeleton-title-line is-small"></span>
            <span className="skeleton-line"></span>
            <span className="skeleton-line skeleton-line-medium"></span>
          </div>
          <div className="page-skeleton-media"></div>
        </div>
      </section>
      <section className="section">
        <div className="container page-skeleton-card-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="page-skeleton-card" key={index}>
              <span className="skeleton-line skeleton-line-short"></span>
              <span className="skeleton-line"></span>
              <span className="skeleton-line skeleton-line-medium"></span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
