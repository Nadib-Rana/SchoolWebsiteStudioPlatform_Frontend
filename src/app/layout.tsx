import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SchoolCanvas — Website Studio",
  description: "Next-generation School Website Studio & Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

