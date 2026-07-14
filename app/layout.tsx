import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://workbenchdev.vercel.app"),

  title: {
    default: "Workbench",
    template: "%s | Workbench",
  },

  description:
    "Workbench is an engineering operating system for managing projects, documenting architecture, recording engineering decisions, tracking patterns, maintaining journals, and building software with intention.",

  keywords: [
    "Workbench",
    "Engineering",
    "Engineering OS",
    "Developer Workspace",
    "Software Engineering",
    "Documentation",
    "Architecture",
    "Engineering Journal",
    "Decision Log",
    "Knowledge Base",
    "Project Management",
    "Patterns",
    "Developer Tools",
    "Software Development",
  ],

  applicationName: "Workbench",

  authors: [
    {
      name: "Ruben Caleb",
      url: "https://devfolio-rv-caleb-v3.vercel.app",
    },
  ],

  creator: "Ruben Caleb",
  publisher: "Ruben Caleb",

  icons: {
    icon: [{ url: "/logo/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo/logo.svg",
    apple: "/logo/logo.svg",
  },

  openGraph: {
    title: "Workbench | Engineering Operating System",

    description:
      "Build. Document. Iterate. A modern workspace for projects, architecture, engineering journals, reusable patterns, and technical knowledge.",

    url: "/",

    siteName: "Workbench",

    type: "website",

    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Workbench",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Workbench | Engineering Operating System",

    description:
      "The engineering operating system for modern software builders.",

    images: ["/og"],
  },

  alternates: {
    canonical: "/",
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className= "h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
