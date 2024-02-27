import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { cn } from "@/lib/utils";
import AuthHeader from "@/components/shared/AuthHeader";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
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
        <main className=''>
            <AuthHeader />
            {children}
        </main>
      </body>
    </html>
  );
}
