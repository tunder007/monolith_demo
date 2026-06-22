import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Softeneers Framework — fullstack apps in one command",
  description:
    "A modular fullstack project generator. Spin up a Next.js + Express + MySQL app with auth, email, storage, and Docker — one command, npm or pnpm.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
