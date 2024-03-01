import { initAdmin } from "@/firebase/server/config"
import { UserType } from "@/lib/types/userTypes"
import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Profile()
{
    const admin = await initAdmin()
    const cookiesData = cookies()
    const token = await decode({ token: cookiesData.get(process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token')?.value, secret: process.env.NEXTAUTH_SECRET! })

    const user = token?.sub ? (await admin.firestore().collection('users')?.doc(token?.sub as string).get()).data() as UserType : null

    if(!user?.verified) return redirect('/sign-in')

    return (
        <section className='w-full h-full flex gap-16 items-center justify-center'>
            <div className='flex flex-col w-fit'>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div></div>
        </section>
    )
}