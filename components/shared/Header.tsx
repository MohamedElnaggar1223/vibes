import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import SignedInHeader from "./SignedInHeader";
import CategoriesHeaderLink from "./CategoriesHeaderLink";
import { getCategories, initTranslations } from "@/lib/utils";
import LocaleSwitcher from "./LocaleSwitcher";
import { unstable_noStore as noStore } from "next/cache";
import { initAdmin } from "@/firebase/server/config";
import { UserType } from "@/lib/types/userTypes";
import { decode } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import MobileMenu from "./MobileMenu";

type Props = {
    params: {
        locale?: string
    }
}

const getUser = async () => {
    const admin = await initAdmin()
    const cookiesData = cookies()
    const token = await decode({ token: cookiesData.get(process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token')?.value, secret: process.env.NEXTAUTH_SECRET! })
    if (token?.sub) {
        const user = (await admin.firestore().collection('users')?.doc(token?.sub as string).get()).data()
        const userClient = { ...user, cart: user?.cart && user?.cart.tickets.length ? { ...user.cart, createdAt: user.cart?.createdAt?.toDate() } : undefined } as UserType

        return userClient
    }
    return null
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Header({ params }: Props) {
    noStore();
    headers()
    const { t } = await initTranslations(params?.locale ?? 'en', ['homepage', 'common'],)
    const session = await getServerSession()
    const categories = await getCategories()
    const user = await getUser()

    return (
        <header dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='py-2 lg:px-20 min-w-full flex justify-between items-center sticky top-0 z-[99999999999] bg-black'>
            <Link href='/'>
                <Image
                    src="/assets/logo.png"
                    width={110}
                    height={53}
                    alt="logo"
                    className='cursor-pointer max-lg:w-[100px] max-lg:h-[53px]'
                    priority
                />
            </Link>
            <div className="flex gap-6 lg:gap-24 items-center max-lg:mr-4 max-md:hidden">
                <Link href='https://seller.whim-zee.com/' className='font-poppins text-nowrap text-xs md:text-lg font-[300] z-[9999] text-white'>{t('common:sellTickets')}</Link>
                <CategoriesHeaderLink categories={categories} />
                {/* <Link href='/' className='text-white font-poppins text-lg font-[300]'>
                    Sell Your Tickets
                </Link> */}
                <Link href='/resell-market' className='font-poppins text-nowrap text-xs md:text-lg font-[300] z-[9999] text-white'>{t('common:resellMarket')}</Link>
                {/* <Link href='/hotel-reservations' className='font-poppins text-xs md:text-lg font-[300] z-[9999] text-white'>Hotel Reservations</Link>
                <Link href='/digital-products' className='font-poppins text-xs md:text-lg font-[300] z-[9999] text-white'>Digital Products</Link> */}
                <LocaleSwitcher params={params} />
                {
                    !session?.user || !user?.id ? (
                        <Link href='/sign-in'>
                            <button className='font-poppins text-xs md:text-[16px] bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] rounded-full px-3 py-1 md:px-6 md:py-2 text-white'>
                                {t('common:sign-in')}
                            </button>
                        </Link>
                    ) : (
                        <SignedInHeader user={user!} />
                    )
                }
            </div>
            <div className='md:hidden'>
                <MobileMenu params={params} categories={categories} session={session} user={user} />
            </div>
        </header>
    )
}
