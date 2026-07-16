import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";

import "./globals.css";
import "./kiosk.css";

// The original concept page asked for these two by name but never loaded them, so it fell
// back to the system monospace. next/font self-hosts them, which also keeps the kiosk off
// the venue wifi at runtime.
const body = VT323({
  variable: "--font-body",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const pixel = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MEI MEI",
  description:
    "Which one are you? A creativity quiz from the College of Computer Studies.",
};

/** One laptop, touched by students. No pinch-zoom for a student to get stuck inside. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#07060f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${body.variable} ${pixel.variable} h-full`}>
      <body className="mmq min-h-full antialiased">{children}</body>
    </html>
  );
}
