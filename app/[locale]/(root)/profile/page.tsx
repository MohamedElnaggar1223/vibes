import { initAdmin } from "@/firebase/server/config"
import { UserType } from "@/lib/types/userTypes"
import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import MyProfile from "@/components/auth/profile/MyProfile"
import { revalidatePath } from "next/cache"
import { Timestamp } from "firebase/firestore"

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: Props) 
{
    return {
        title: `${typeof searchParams.show !== 'string' ? 'My Profile' : searchParams.show === 'personal' ? 'My Profile' : searchParams.show === 'change-password' ? 'Change Password' : searchParams.show === 'my-tickets' ? 'My Tickets' : 'My Profile'} - Vibes`,
    }
}

export default async function Profile()
{
    const admin = await initAdmin()
    const cookiesData = cookies()
    const token = await decode({ token: cookiesData.get(process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token')?.value, secret: process.env.NEXTAUTH_SECRET! })

    const user = token?.sub ? (await admin.firestore().collection('users')?.doc(token?.sub as string).get()).data() as UserType : null

    const userData = user ? { ...user, cart: {...user.cart, createdAt: (user.cart?.createdAt as unknown as Timestamp)?.toDate()} } as UserType : undefined

    if(!user?.verified) return redirect('/sign-in')

    revalidatePath('/profile?show=my-tickets')

    return (
        <MyProfile user={userData!} />
    )
}