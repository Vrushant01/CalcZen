import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/providers";
import "../styles.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://calczen.in"),
  title: "CalcZen — Smart Online Calculators",
  description:
    "Discover free online calculators for personal finance, health tracking, mathematics, and daily helpers. Get fast, accurate results with transparent formulas.",
  authors: [{ name: "CalcZen" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: "CalcZen",
    type: "website",
    images: "/icons/android-chrome-512x512.png",
  },
  twitter: {
    card: "summary_large_image",
    images: "/icons/android-chrome-512x512.png",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <head>
        {/* Google AdSense & Monetag */}
        <meta name="google-adsense-account" content="ca-pub-9718443992724384" />
        <meta name="monetag" content="054c05b71822f90f5014206670b66bac" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9718443992724384"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Theme Initialization Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var t = localStorage.getItem("calczen-theme");
                  var d =
                    t === "dark" ||
                    (t !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
                  document.documentElement.classList.toggle("dark", d);
                } catch (e) { }
              })();
            `,
          }}
        />
        {/* Google Analytics tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FTZXW6Z0RV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FTZXW6Z0RV');
          `}
        </Script>
        {/* Third-party Push/Tag scripts */}
        <Script id="nap5k-tag" strategy="afterInteractive">
          {`(function (s) { s.dataset.zone = '11269021', s.src = 'https://nap5k.com/tag.min.js' })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
        </Script>
        <Script
          src="https://5gvci.com/act/files/tag.min.js?z=11269027"
          data-cfasync="false"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
