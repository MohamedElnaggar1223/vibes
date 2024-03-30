import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localfont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt"
import { UserType } from "@/lib/types/userTypes";
import { redirect } from "next/navigation";
import { initAdmin } from "@/firebase/server/config";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
  adjustFontFallback: true,
})

const myFont = localfont({ src: '../../../public/fonts/BeldaDidoneNormDemiItalic.ttf' })

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
  if(token?.sub)
  {
    const user = (await admin.firestore().collection('users')?.doc(token?.sub as string).get()).data() as UserType
    if(!user?.verified) return redirect('/complete-profile')
  }

  return (
    <html lang="en">
      <body className={cn('', poppins.variable, myFont.className)}>
          <main className=''>
              {children}
          </main>
      </body>
    </html>
  );
}
