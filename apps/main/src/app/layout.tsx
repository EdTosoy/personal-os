import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MenuProvider } from "@/context/MenuContext";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { pageMetadata } from "@/lib/metadata";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  ...pageMetadata(
    "Edberto Tosoy — Full-Stack Software Engineer",
    "Full-stack software engineer with production React and TypeScript banking experience and independent backend, financial systems, and AWS projects. Based in Metro Manila, Philippines.",
    "/",
  ),
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-ink text-fg"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          <MenuProvider>{children}</MenuProvider>
        </ThemeProvider>
        {process.env.VERCEL === "1" && <Analytics />}
      </body>
    </html>
  );
}
