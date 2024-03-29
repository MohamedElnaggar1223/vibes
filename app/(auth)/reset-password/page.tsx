import ResetPassword from "@/components/auth/reset-password/ResetPassword"
import { initAdmin } from "@/firebase/server/config"
import { UserType } from "@/lib/types/userTypes"
import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type Props = {
	searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ResetPasswordPage({ searchParams }: Props) 
{
    const oobCode = typeof searchParams.oobCode === 'string' ? searchParams.oobCode : undefined
    const mode = typeof searchParams.oobCode === 'string' ? searchParams.mode : undefined

    if(!oobCode || !mode) return redirect('/sign-in')

    const admin = await initAdmin()
    const cookiesData = cookies()
    const token = await decode({ token: cookiesData.get(process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token')?.value, secret: process.env.NEXTAUTH_SECRET! })
    // console.log('token layout: ', token)
    if(token?.sub)
    {
        const user = (await admin.firestore().collection('users').doc(token?.sub as string).get()).data() as UserType
        if(user?.verified) return redirect('/')
    }

    return <ResetPassword oobCode={oobCode} />
}