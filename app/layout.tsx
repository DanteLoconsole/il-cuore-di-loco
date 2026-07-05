import { Playwrite_HR_Lijeva } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const script = Playwrite_HR_Lijeva({
  variable: "--font-playwrite",
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${script.variable} min-h-screen`}>
      <body className="flex min-h-screen min-w-[240px] flex-col justify-between bg-accent text-header">
        {children}
      </body>
    </html>
  );
}
