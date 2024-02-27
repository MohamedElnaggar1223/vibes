import CompleteProfileData from "@/components/auth/complete-profile/CompleteProfileData"
import CompleteProfileOTP from "@/components/auth/complete-profile/CompleteProfileOTP"
import { initAdmin } from "@/firebase/server/config"
import { UserType } from "@/lib/types/userTypes"
import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function CompleteProfile()
{
    const admin = await initAdmin()
    const cookiesData = cookies()
    const token = await decode({ token: cookiesData.get(process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token')?.value, secret: process.env.NEXTAUTH_SECRET! })
    if(!token?.sub) return redirect('/sign-in')

    const user = (await admin.firestore().collection('users').doc(token?.sub as string).get()).data() as UserType

    if(!user.countryCode || !user.phoneNumber) return <CompleteProfileData user={{...user, id: token.sub}} />
    else return <CompleteProfileOTP user={{...user, id: token.sub}} />
}