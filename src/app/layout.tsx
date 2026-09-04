import type { Metadata } from "next";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc-provider";

export const metadata: Metadata = {
  title: "Songscription",
  description: "Learn piano your way",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
