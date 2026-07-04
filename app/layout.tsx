import type { Metadata } from "next";
import { Playwrite_HR_Lijeva } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const script = Playwrite_HR_Lijeva({
  variable: "--font-playwrite",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Il Cuore di Loco",
  description:
    "Charmante B&B in het hart van Locorotondo, Puglia — met adembenemend uitzicht over de Itria Vallei.",
  icons: "/logo_trans.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${script.variable} min-h-screen`}>
      <body className="flex min-h-screen min-w-[240px] flex-col justify-between bg-accent text-header">
        <Header />
        <main className="container flex h-full min-w-full flex-1 flex-col items-center justify-center">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
