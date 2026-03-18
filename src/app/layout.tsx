import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZyncSlot | Premium SaaS Booking",
  description: "Advanced multi-tenant scheduling & booking SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
