import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { cn } from "@/lib/utils";
import AuthHeader from "@/components/shared/AuthHeader";
import { Suspense } from "react";

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
          src="/assets/authBackground.png"
          fill
          alt="background"
          className='bg-image max-md:hidden'
          priority
          quality={100}
        />
        <main className='min-h-screen max-lg:max-w-[100vw] max-lg:overflow-hidden'>
            <AuthHeader />
            <section className='h-full flex max-lg:max-w-[100vw]'>
              <section className='min-h-full pt-28 flex flex-col justify-between px-20 w-full bg-svg max-md:hidden'>
                <Image
                  src="/assets/gradients.svg"
                  fill
                  alt="background"
                  className='bg-svg-img'
                  priority
                  quality={100}
                />
                <div className='text-white font-poppins text-6xl flex flex-col'>
                  <span>
                    Your Go To 
                  </span>
                  <span>
                    Ticketing Platform
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='font-poppins text-white text-2xl font-semibold mb-3'>
                    Don't Skip a Beat.. 
                  </span>
                  <span className='font-poppins text-white text-2xl font-normal flex flex-col'>
                    <span>
                      Get access to all the premium events
                    </span>
                    <span>
                      throughout the year in UAE, KSA & Egypt!
                    </span>
                  </span>
                </div>
                <div />
              </section>
              <Suspense>
                {children}
              </Suspense>
            </section>
        </main>
      </body>
    </html>
  );
}
