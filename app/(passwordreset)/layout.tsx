import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: "Reset Password - Vibes",
  description: "Buy and sell your tickets online",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('h-screen', poppins.variable)}>
        <Image
          src="/assets/background.svg"
          fill
          alt="background"
          className='bg-image'
          priority
          quality={100}
        />
        <main className='min-h-screen max-lg:max-w-[100vw] max-lg:overflow-hidden'>
            {children}
        </main>
      </body>
    </html>
  );
}
