import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { cn } from "@/lib/utils";
import AuthHeader from "@/components/shared/AuthHeader";
import { redirect, RedirectType } from "next/navigation";
import { initAdmin } from "@/firebase/server/config";
import { UserType } from "@/lib/types/userTypes";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

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
  const admin = await initAdmin()
  const cookiesData = cookies()
  const token = await decode({ token: cookiesData.get(process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token')?.value, secret: process.env.NEXTAUTH_SECRET! })
  // console.log('token layout: ', token)
  if(token?.sub)
  {
    const user = (await admin.firestore().collection('users').doc(token?.sub as string).get()).data() as UserType
    if(user?.verified) return redirect('/')
  }

  return (
    <html lang="en">
      <body className={cn('', poppins.variable)}>
        <Image
          src="/assets/authBackground.png"
          fill
          alt="background"
          className='bg-image'
          priority
          quality={100}
        />
        <Image
          src="/assets/gradients.svg"
          fill
          alt="background"
          className='bg-svg'
          priority
          quality={100}
        />
        <main className='min-h-screen'>
            <AuthHeader />
            <section className='h-full flex'>
              <section className='min-h-full pt-28 flex flex-col justify-between px-20'>
                <div className='text-white font-poppins text-5xl flex flex-col'>
                  <span>
                    Your Go To 
                  </span>
                  <span>
                    Ticketing Platform
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='font-poppins text-white text-base font-semibold mb-3'>
                    Don't Skip a Beat.. 
                  </span>
                  <span className='font-poppins text-white text-base font-normal flex flex-col'>
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
              {children}
            </section>
        </main>
      </body>
    </html>
  );
}
