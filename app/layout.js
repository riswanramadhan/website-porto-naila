import "./globals.css";
import { fetchSiteProfile } from "@/lib/portfolio";

export async function generateMetadata() {
  const profile = await fetchSiteProfile();
  const title = "Naila Azahra | Psychology, HR & Leadership Portfolio";
  const description =
    "Portfolio of Naila Azahra, a psychology student focused on Human Resources, Talent Development, Leadership, and Organizational Growth.";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nailaazahra.vercel.app"; // Fallback URL
  
  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: ["Naila Azahra", "Psychology", "HR", "Leadership", "Talent Development", "Portfolio", "Human Resources", "Hasanuddin University"],
    authors: [{ name: "Naila Azahra" }],
    creator: "Naila Azahra",
    openGraph: {
      title,
      description,
      url: "/",
      siteName: "Naila Azahra Portfolio",
      images: [
        {
          url: profile?.image?.src || "/logo-unhas.png",
          width: 800,
          height: 600,
          alt: "Naila Azahra Portfolio",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [profile?.image?.src || "/logo-unhas.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" data-language="en">
      <head>
        <meta name="google-site-verification" content="RnssxGQ8CbQhVWsYIQjzn6znRvUMUhq7svJ54Gu4bTc" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Naila Azahra",
              url: "https://nailaazahra.vercel.app",
              jobTitle: "Psychology & HR Professional",
              worksFor: {
                "@type": "Organization",
                name: "Hasanuddin University"
              },
              sameAs: [
                "https://www.linkedin.com/in/naila-azahra/"
              ]
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
