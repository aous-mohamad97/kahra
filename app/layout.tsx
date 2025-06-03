// frontend/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { api, SiteSettings } from "@/lib/api";
import { getAbsoluteImageUrl } from "@/lib/utils";
import { PageLoadingIndicator } from "@/components/providers/PageLoadingIndicator";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

async function getLayoutData(): Promise<SiteSettings | null> {
  try {
    const response = await api.getSiteSettings();
    // The 'data' property from APIResponse<SiteSettings | null>
    // And the actual SiteSettings object is nested inside that if not null
    return response?.data || null;
  } catch (error) {
    console.error("Failed to fetch site settings for layout:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getLayoutData();

  const siteName = settings?.site_name || "KahraGen Engineering";
  const defaultTitle = settings?.default_meta_title || siteName;
  const description =
    settings?.default_meta_description ||
    "Powering 5.8 GW across the region with EPC excellence.";

  // Assuming settings.default_meta_keywords is already an array from the API due to backend casting and JSON response
  const keywordsArray: string[] =
    settings?.default_meta_keywords &&
    Array.isArray(settings.default_meta_keywords)
      ? settings.default_meta_keywords
      : ["engineering", "power", "sustainability", "EPC"]; // Fallback

  // Favicon, Apple Icon
  // The API response provides `favicon_url` which is already transformed by the backend (e.g., /storage/path)
  // `getAbsoluteImageUrl` makes it fully qualified (e.g., http://localhost:8000/storage/path)
  const faviconUrl = settings?.favicon_url
    ? getAbsoluteImageUrl(settings.favicon_url)
    : "/favicon.ico";
  // For apple-touch-icon, it's best to have a dedicated PNG.
  // If you add `apple_touch_icon_path` & `apple_touch_icon_url` to SiteSettings:
  // const appleIconUrl = settings?.apple_touch_icon_url ? getAbsoluteImageUrl(settings.apple_touch_icon_url) : "/apple-touch-icon.png";
  // For now, using a static one or deriving from a PNG favicon:
  const appleIconUrl =
    settings?.favicon_url && settings.favicon_url.endsWith(".png")
      ? getAbsoluteImageUrl(settings.favicon_url)
      : "/apple-touch-icon.png";

  const ogImageUrl = settings?.default_og_image_url
    ? getAbsoluteImageUrl(settings.default_og_image_url)
    : `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://kahragen.com"
      }/default-og-image.jpg`; // Fallback to a static OG image in public folder

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "https://kahragen.com"
    ),
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`,
    },
    description: description,
    keywords: keywordsArray,
    authors: [
      {
        name: siteName,
        url: process.env.NEXT_PUBLIC_BASE_URL || "https://kahragen.com",
      },
    ],
    creator: siteName,
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: appleIconUrl,
      // other: [ { rel: 'apple-touch-icon-precomposed', url: appleIconUrl } ] // Example for precomposed
    },
    manifest: "/manifest.webmanifest", // Standard name, ensure it exists in /public
    openGraph: {
      type: "website",
      locale: "en_US",
      url: process.env.NEXT_PUBLIC_BASE_URL || "https://kahragen.com",
      siteName: siteName,
      title: defaultTitle,
      description: description,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl, // This should be an absolute URL
              width: 1200,
              height: 630,
              alt: `${siteName} OpenGraph Image`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: description,
      images: ogImageUrl ? [ogImageUrl] : [], // This should be an absolute URL
      // site: '@yourTwitterHandle', // Optional: Add your Twitter handle
      // creator: '@creatorTwitterHandle', // Optional
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: settings?.google_verification_code || undefined, // Pass undefined if empty
    },
    // alternates: { // Example for canonical URLs or different languages
    //   canonical: '/',
    //   languages: {
    //     'en-US': '/en-US',
    //   },
    // },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const settings = await getLayoutData();
  return {
    themeColor: settings?.theme_color || "#0A2540", // Fallback to your primary dark color
    // width: 'device-width', // Default
    // initialScale: 1, // Default
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Most meta tags are now handled by `generateMetadata` and `generateViewport`.
          Preconnects are still good to keep here.
          Any other critical static head elements can also remain.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous" // React expects "anonymous" not "true" for crossOrigin
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} font-body antialiased bg-background text-foreground selection:bg-primary selection:text-primary-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // Or make this dynamic from settings if needed
          enableSystem
          disableTransitionOnChange
        >
          <PageLoadingIndicator /> {/* <-- Add the indicator here */}
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {" "}
              {/* Removed complex min-h, flex-grow handles it with parent */}
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
