'use client'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CategoriesHeaderLink from "./CategoriesHeaderLink";
import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslation } from "react-i18next";
import { UserType } from "@/lib/types/userTypes";
import SignedInHeader from "./SignedInHeader";

type Props = {
    params: {
        locale?: string
    }
    categories: {
        id: string;
        createdAt: Date;
        category: string;
        categoryArabic: string;
        color: number;
        events: string[];
    }[]
    session: {
        user: {
            id: string;
            name?: string | null | undefined;
            email?: string | null | undefined;
            image?: string | null | undefined;
        };
        expires: string;
    } | null
    user: UserType | null
}

export default function MobileMenu({ params, categories, session, user }: Props) {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation('common')

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {open ? <X stroke='#fff' className='mr-4' /> : <Menu stroke='#fff' className='mr-4' />}
            </PopoverTrigger>
            <PopoverContent className='w-screen p-0 flex flex-col rounded-none border-none divide-y divide-[#909090] bg-black mt-[1.2rem] z-[99999]'>
                <Link href='https://seller.whim-zee.com/' className='font-poppins text-nowrap py-2 text-center text-lg font-[300] z-[9999] text-white'>{t('common:sellTickets')}</Link>
                <CategoriesHeaderLink categories={categories} />
                {/* <Link href='/' className='text-white font-poppins text-lg font-[300]'>
                    Sell Your Tickets
                </Link> */}
                <Link href='/resell-market' className='font-poppins text-nowrap py-2 text-center text-lg font-[300] z-[9999] text-white'>{t('common:resellMarket')}</Link>
                {/* <Link href='/hotel-reservations' className='font-poppins text-lg font-[300] z-[9999] text-white'>Hotel Reservations</Link>
                <Link href='/digital-products' className='font-poppins text-lg font-[300] z-[9999] text-white'>Digital Products</Link> */}
                <LocaleSwitcher params={params} />
                {
                    !session?.user || !user?.id ? (
                        <Link href='/sign-in' className='py-2 flex items-center justify-center'>
                            <button className='font-poppins text-[16px] bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] rounded-full px-3 py-1 md:px-6 md:py-2 text-white'>
                                {t('common:sign-in')}
                            </button>
                        </Link>
                    ) : (
                        <SignedInHeader user={user!} />
                    )
                }
            </PopoverContent>
        </Popover>
    )
}