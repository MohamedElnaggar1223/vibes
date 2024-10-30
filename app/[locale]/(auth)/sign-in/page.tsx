import SignIn from "@/components/auth/SignIn"
import { initAdmin } from "@/firebase/server/config"
import { UserType } from "@/lib/types/userTypes"
import { decode } from "next-auth/jwt"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { allowFacebookLogin } from "@/flags"

export default async function SignInPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } })
{
    const redirectUrl = typeof searchParams.redirectUrl === 'string' ? searchParams.redirectUrl : undefined

    const admin = await initAdmin()
    const cookiesData = cookies()
    const token = await decode({ token: cookiesData.get(process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token')?.value, secret: process.env.NEXTAUTH_SECRET! })
    // console.log('token layout: ', token)
    if(token?.sub)
    {
        const user = (await admin.firestore().collection('users').doc(token?.sub as string).get()).data() as UserType
        if(user?.verified) return redirectUrl ? redirect(redirectUrl) : redirect('/')
    }

    // const facebookLogin = await allowFacebookLogin()

    return (
        <Suspense>
            <SignIn redirectUrl={redirectUrl} facebookLogin={false} />
        </Suspense>
    )
}