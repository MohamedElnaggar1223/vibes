import SignUp from "@/components/auth/SignUp"
import { initAdmin } from "@/firebase/server/config"
import { UserType } from "@/lib/types/userTypes"
import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

type Props = {
    params: {
        locale?: string
    }
}

export default async function SignUpPage({ params }: Props)
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
        <Suspense fallback={<Loading />}>
            <SignUp locale={params.locale} />
        </Suspense>
    )
}