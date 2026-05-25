import "./globals.css";

export const metadata = {
  title: "Naila Azahra | Psychology, HR & Leadership Portfolio",
  description:
    "Portfolio of Naila Azahra, a psychology student focused on Human Resources, Talent Development, Leadership, and Organizational Growth.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" data-language="en">
      <head>
        <meta name="google-site-verification" content="RnssxGQ8CbQhVWsYIQjzn6znRvUMUhq7svJ54Gu4bTc" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
