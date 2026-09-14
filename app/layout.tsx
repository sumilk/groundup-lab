import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GroundUp Lab — Research Engineering Mastery",
  description: "LLM-guided multi-agent tutoring across mathematics, Python, PyTorch, NLP, deep learning, RL, LLM systems, and research.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
