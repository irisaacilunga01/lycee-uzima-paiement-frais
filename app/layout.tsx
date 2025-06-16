import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// export const metadata: Metadata = {
//   metadataBase: new URL(defaultUrl),
//   title: "Next.js and Supabase Starter Kit",
//   description: "The fastest way to build apps with Next.js and Supabase",
// };

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Lycée UZIMA – Paiement des frais scolaires",
  description:
    "Application moderne pour le suivi et la gestion des frais scolaires au Lycée UZIMA à Likasi.",
  openGraph: {
    title: "Lycée UZIMA – Paiement des frais scolaires",
    description:
      "Suivi transparent des paiements, gestion simplifiée des frais scolaires pour le Lycée UZIMA.",
    url: defaultUrl,
    siteName: "Lycée UZIMA",
    images: [
      {
        url: `${defaultUrl}/saacTech.png`,
        width: 1200,
        height: 630,
        alt: "Lycée UZIMA – Paiement des frais scolaires",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lycée UZIMA – Paiement des frais scolaires",
    description:
      "Application web de suivi des paiements scolaires développée avec Next.js et Supabase.",
    images: [`${defaultUrl}/saacTech.png`],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
