import ForgotPassword from "@/components/auth/forgot-password/ForgotPassword"
import { initAdmin } from "@/firebase/server/config"
import { UserType } from "@/lib/types/userTypes"
import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function ForgotPasswordPage()
{
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
        <ForgotPassword />
    )
}