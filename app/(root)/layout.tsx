import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Header from "@/components/shared/Header";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import Loading from "./loading";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: "Vibes",
  description: "Buy and sell your tickets online",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('', poppins.variable)}>
        <Image
          src="/assets/background.svg"
          fill
          alt="background"
          className='bg-image'
          priority
        />
        <Header />
        <main className='px-6 md:px-20'>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}
