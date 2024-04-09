import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Header from "@/components/shared/Header";
import { cn, initTranslations } from "@/lib/utils";
import { cache } from "react";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt"
import { UserType } from "@/lib/types/userTypes";
import { redirect } from "next/navigation";
import { initAdmin } from "@/firebase/server/config";
import CountryContextProvider from "@/providers/CountryProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "@/components/shared/Footer";
import { i18nConfig } from "@/i18nConfig";
import TranslationsProvider from "@/providers/TranslationsProvider";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
  adjustFontFallback: true,
})

export function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ locale }));
}

export const metadata: Metadata = {
  title: "Vibes",
  description: "Buy and sell your tickets online",
  openGraph: {
    images: 'https://firebasestorage.googleapis.com/v0/b/test-2cf5b.appspot.com/o/play_store_512.png?alt=media&token=a5f145ce-53c4-48af-a75e-26f81067cd87'
  }
};

const getUser = cache(async () => {
  const admin = await initAdmin()
  const cookiesData = cookies()
  const token = await decode({ token: cookiesData.get(process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token')?.value, secret: process.env.NEXTAUTH_SECRET! })
  if(token?.sub)
  {
    return (await admin.firestore().collection('users')?.doc(token?.sub as string).get()).data() as UserType 
  }
  return null
})

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: {
    locale?: string;
  }
}>) {

  const user = await getUser()
  if(user && !user.verified) return redirect('/complete-profile')

  const { resources } = await initTranslations(params.locale ?? 'en', ['homepage', 'common', 'auth'])

  return (
    <html lang={params.locale}>
      <meta name="google-site-verification" content="irnPUXjZLm_rx9_Xs0zW_MaO1dC4yFnVfVSGBb0wjZw" />
      <meta property='og:image' content='https://firebasestorage.googleapis.com/v0/b/test-2cf5b.appspot.com/o/play_store_512.png?alt=media&token=a5f145ce-53c4-48af-a75e-26f81067cd87' />
      <body className={cn('max-w-[100vw] overflow-x-hidden', poppins.variable)}>
        <Image
          src="/assets/background.svg"
          fill
          alt="background"
          className='bg-image'
          priority
        />
        <TranslationsProvider locale={params.locale!} resources={resources} namespaces={['homepage', 'common', 'auth']}>
          <CountryContextProvider>
            <Header params={params} />
            <main className='px-6 md:px-20 min-h-screen flex'>
              {children}
              <SpeedInsights />
            </main>
            <Footer params={params} />
          </CountryContextProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}
