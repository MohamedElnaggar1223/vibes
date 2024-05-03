'use client'

import { cn } from "@/lib/utils"
import { useState } from "react"
import FormattedPrice from "./FormattedPrice"
import { ExchangeRate } from "@/lib/types/eventTypes"
import { Timestamp, deleteField, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase/client/config"
import { usePathname, useRouter } from "next/navigation"
import { TicketType } from "@/lib/types/ticketTypes"
import { UserType } from "@/lib/types/userTypes"
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next"

type Props = {
    total: number
    ticketsTotal: number
    parkingTotal: number
    exchangeRate: ExchangeRate
    tickets: TicketType[]
    user: UserType
    totalNumberParkingPasses: number
    totalNumberTickets: number
}

export default function ProceedToPayment({ parkingTotal, ticketsTotal, total, exchangeRate, tickets, user, totalNumberParkingPasses, totalNumberTickets }: Props)
{
    const [promoCode, setPromoCode] = useState('')
    const [loading, setLoading] = useState(false)

    const pathname = usePathname()

    const { t } = useTranslation()

    const router = useRouter()

    const handleBuy = async () => {
        setLoading(true)
        const salesDoc = await getDoc(doc(db,'sales', process.env.NEXT_PUBLIC_SALES_ID!))
        await updateDoc(doc(db, 'users', user?.id ?? ''), { cart: { tickets: [], createdAt: null, status: 'pending' } })
        await updateDoc(doc(db,'sales', process.env.NEXT_PUBLIC_SALES_ID!), { totalRevenue: salesDoc.data()?.totalRevenue + total, totalTicketsSold: salesDoc.data()?.totalTicketsSold + totalNumberTickets, totalSales: salesDoc.data()?.totalSales + totalNumberTickets + totalNumberParkingPasses, updatedAt: Timestamp.now() })

        const ticketsUpdate = tickets.map(async ticket => await updateDoc(doc(db, 'tickets', ticket.id), { status: 'paid' }))

        await Promise.all(ticketsUpdate)

        setLoading(false)
        router.push(`/success/${tickets[0].id}`)
    }

    return (
        <div dir={pathname?.startsWith('/ar') ? 'rtl' : 'ltr'} className='flex flex-col items-center justify-center gap-4 w-full lg:w-screen lg:max-w-[518px]'>
            <p className={cn('font-poppins flex-1 text-white font-light text-sm lg:text-base w-full', pathname?.startsWith('/ar') ? 'text-right' : 'text-left')}>{t('doPromo')}</p>
            <div className='flex h-12 lg:h-20 px-4 lg:pl-20 lg:pr-4 items-center justify-center rounded-md bg-white w-full'>
                <input
                    type='text'
                    placeholder={t('promo')}
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    className='text-black outline-none placeholder:text-[rgba(0,0,0,0.5)] font-poppins font-light text-xs lg:text-sm flex-1'
                />
                <p className={cn('font-poppins font-light text-xs lg:text-sm underline cursor-pointer', promoCode.length ? 'text-black' : 'text-[rgba(0,0,0,0.5)]')}>{t('applyPromo')}</p>
            </div>
            <div className='flex flex-col px-4 py-4 items-center justify-center rounded-md bg-white divide-y w-full gap-4'>
                <div className='flex justify-between items-center w-full'>
                    <p className='font-poppins text-black font-semibold text-sm lg:text-base'>{t('total')}</p>
                    <p className='font-poppins text-black font-semibold text-sm lg:text-base'><FormattedPrice price={total} exchangeRate={exchangeRate} /></p>
                </div>
                <div className='flex flex-col w-full gap-4'>
                    <div className='flex justify-between items-center w-full'>
                        <p className='font-poppins text-[rgba(0,0,0,0.5)] font-normal text-xs lg:text-md'>{t('tickets')}</p>
                        <p className='font-poppins text-[rgba(0,0,0,0.5)] font-normal text-xs lg:text-md'><FormattedPrice price={ticketsTotal} exchangeRate={exchangeRate} /></p>
                    </div>
                    {parkingTotal > 0 && (
                        <div className='flex justify-between items-center w-full'>
                            <p className='font-poppins text-[rgba(0,0,0,0.5)] font-normal text-xs lg:text-md'>{t('parkingPass')}</p>
                            <p className='font-poppins text-[rgba(0,0,0,0.5)] font-normal text-xs lg:text-md'><FormattedPrice price={parkingTotal} exchangeRate={exchangeRate} /></p>
                        </div>
                    )}
                    <div className='flex justify-between items-center w-full'>
                        <p className='font-poppins text-[rgba(0,0,0,0.5)] font-normal text-xs lg:text-md'>{t('discount')}</p>
                        <p className='font-poppins text-[rgba(0,0,0,0.5)] font-normal text-xs lg:text-md'><FormattedPrice price={0} exchangeRate={exchangeRate} /></p>
                    </div>
                </div>
            </div>
            <button onClick={handleBuy} className={cn('cursor-pointer max-w-[412px] mt-4 bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] rounded-md font-light py-5 px-10 w-full text-white font-poppins')}>{t('proceedPayment')}</button>
            <Dialog open={loading}>
                <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                    <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                </DialogContent>
            </Dialog>
        </div>
    )
}