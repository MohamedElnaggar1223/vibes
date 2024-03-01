import { initAdmin } from "@/firebase/server/config"
import { UserType } from "@/lib/types/userTypes"
import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Loading from './loading'
import MyProfile from "@/components/shared/MyProfile"

export default async function Profile()
{
    const admin = await initAdmin()
    const cookiesData = cookies()
    const token = await decode({ token: cookiesData.get(process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token')?.value, secret: process.env.NEXTAUTH_SECRET! })

    const user = token?.sub ? (await admin.firestore().collection('users')?.doc(token?.sub as string).get()).data() as UserType : null

    if(!user?.verified) return redirect('/sign-in')

    return (
        <Suspense fallback={<Loading />}>
            <MyProfile user={user} />
        </Suspense>
    )
}