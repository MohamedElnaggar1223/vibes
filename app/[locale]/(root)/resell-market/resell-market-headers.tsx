'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"

export default function ResellMarketHeaders({ locale }: { locale?: string })
{
    const pathname = usePathname()

    const { t } = useTranslation()

    return (
        <header className='py-4 flex gap-4 items-center justify-center w-full max-md:flex-col'>
            <Link href='/resell-market' className={cn('rounded-[4px] font-light py-2 flex-1 max-w-[197px] w-screen px-2 font-poppins text-center flex items-center justify-center', (pathname?.includes('/resell-market')) ? 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] text-white' : 'bg-white text-black')}>{t('tickets')}</Link>
            <Link href='/digital-products' className={cn('rounded-[4px] font-light py-2 flex-1 max-w-[197px] w-screen px-2 font-poppins text-center flex items-center justify-center', (pathname?.includes('/digital-products')) ? 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] text-white' : 'bg-white text-black')}>{t("digitalProducts")}</Link>
            <Link href='/hotel-reservations' className={cn('rounded-[4px] font-light py-2 flex-1 max-w-[197px] w-screen px-2 font-poppins text-center flex items-center justify-center', (pathname?.includes('/hotel-reservations')) ? 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] text-white' : 'bg-white text-black')}>{t("hotelReservations")}</Link>
        </header>
    )
}