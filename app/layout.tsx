import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

import { getSiteSettings } from "@/lib/site-settings";

function safeUrl(input: string) {
  try {
    return new URL(input);
  } catch {
    return new URL("https://trongthaievent.vn");
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: safeUrl(settings.siteUrl),
    manifest: "/manifest.webmanifest",
    title: {
      default: settings.defaultTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.defaultDescription,
    keywords: [
      "tổ chức sự kiện",
      "event agency",
      "hội nghị",
      "khai trương",
      "team building",
      "year end party",
      settings.siteName.toLowerCase(),
    ],
    applicationName: settings.siteName,
    category: "event agency",
    authors: [{ name: settings.siteName }],
    creator: settings.siteName,
    publisher: settings.siteName,
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/logo.png", type: "image/png" },
      ],
      apple: [{ url: "/logo.png", type: "image/png" }],
      shortcut: ["/favicon.ico"],
    },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: "/",
      siteName: settings.siteName,
      title: settings.defaultTitle,
      description: settings.defaultDescription,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: settings.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.defaultTitle,
      description: settings.defaultDescription,
      images: ["/twitter-image"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="vi">
      <body className="bg-white text-zinc-950">
        {settings.googleAnalyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalyticsId}');
              `}
            </Script>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
