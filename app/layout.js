import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { fetchSiteProfile } from "@/lib/portfolio";
import SplashScreen from "@/components/SplashScreen";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nailaazahra.site";
const siteName = "Portofolio Naila Azahra";
const pageTitle = "Naila Azahra | Psychology, HR & Leadership Portfolio";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata() {
  const profile = await fetchSiteProfile();
  const description =
    "Portfolio of Naila Azahra, a psychology student focused on Human Resources, Talent Development, Leadership, and Organizational Growth.";
  const baseUrl = siteUrl;

  return {
    metadataBase: new globalThis.URL(baseUrl),
    applicationName: siteName,
    title: {
      default: pageTitle,
      template: "%s | Portofolio Naila Azahra",
    },
    description,
    keywords: [
      "Naila Azahra",
      "Psychology",
      "HR",
      "Leadership",
      "Talent Development",
      "Portfolio",
      "Human Resources",
      "Hasanuddin University",
    ],
    authors: [{ name: "Naila Azahra" }],
    creator: "Naila Azahra",
    alternates: {
      canonical: "/",
    },
    manifest: "/manifest.json",
    icons: {
      icon: "/logo-unhas.png",
      apple: "/logo-unhas.png",
      shortcut: "/logo-unhas.png",
    },
    verification: {
      google: "RnssxGQ8CbQhVWsYIQjzn6znRvUMUhq7svJ54Gu4bTc",
    },
    openGraph: {
      title: pageTitle,
      description,
      url: "/",
      siteName,
      images: [
        {
          url: profile?.image?.src || "/logo-unhas.png",
          width: 800,
          height: 600,
          alt: siteName,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
        inLanguage: "id-ID",
        publisher: {
          "@type": "Person",
          name: "Naila Azahra",
        },
      },
      {
        "@type": "Person",
        name: "Naila Azahra",
        url: siteUrl,
        jobTitle: "Psychology & HR Professional",
        worksFor: {
          "@type": "Organization",
          name: "Hasanuddin University",
        },
        sameAs: ["https://www.linkedin.com/in/naila-azahra/"],
      },
    ],
  };

  return (
    <html
      lang="en"
      data-theme="light"
      data-language="en"
      className={`${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
