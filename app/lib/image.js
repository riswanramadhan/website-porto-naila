const shimmerSvg = `
  <svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#eeeeee" offset="20%" />
        <stop stop-color="#fafafa" offset="50%" />
        <stop stop-color="#eeeeee" offset="80%" />
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="#eeeeee" />
    <rect id="r" width="1200" height="800" fill="url(#g)" />
    <animate href="#r" attributeName="x" from="-1200" to="1200" dur="1.25s" repeatCount="indefinite" />
  </svg>`;

export const shimmerDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(shimmerSvg)}`;

export const optimizedImageProps = {
  placeholder: "blur",
  blurDataURL: shimmerDataUrl,
  quality: 75,
};
