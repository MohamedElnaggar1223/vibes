import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { cn, initTranslations } from "@/lib/utils";
import AuthHeader from "@/components/shared/AuthHeader";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import TranslationsProvider from "@/providers/TranslationsProvider";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: "Whim Zee",
  description: "Buy and sell your tickets online",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: {
    locale?: string | undefined
  }
}>) {
  const { t, resources } = await initTranslations(params.locale ?? 'en', ['homepage', 'common', 'auth'])

  return (
    <html lang={params.locale} dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={cn('', poppins.variable)}>
      <TranslationsProvider locale={params.locale!} resources={resources} namespaces={['homepage', 'common', 'auth']}>
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
              <section className={cn('min-h-full pt-28 flex flex-col justify-between w-full bg-svg max-md:hidden', params.locale === 'ar' && 'pr-40')}>
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
                    {t('auth:goto')} 
                  </span>
                  <span>
                    {t('auth:ticketing')}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='font-poppins text-white text-2xl font-semibold mb-3'>
                    {t('auth:beat')}
                  </span>
                  <span className='font-poppins text-white text-2xl font-normal flex flex-col'>
                    <span>
                      {t('auth:access')}
                    </span>
                    <span>
                      {t('auth:throughout')}
                    </span>
                  </span>
                </div>
                <div />
              </section>
              <Suspense>
                {children}
                <Toaster />
              </Suspense>
            </section>
        </main>
      </TranslationsProvider>
      </body>
    </html>
  );
}
