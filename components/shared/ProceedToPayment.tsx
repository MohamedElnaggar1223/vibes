'use client'

import { cn } from "@/lib/utils"
import { useContext, useEffect, useMemo, useState } from "react"
import FormattedPrice from "./FormattedPrice"
import { ExchangeRate } from "@/lib/types/eventTypes"
import { Timestamp, arrayUnion, deleteDoc, deleteField, doc, getDoc, runTransaction, updateDoc } from "firebase/firestore"
import { db } from "@/firebase/client/config"
import { usePathname, useRouter } from "next/navigation"
import { PromoCode, TicketType } from "@/lib/types/ticketTypes"
import { UserType } from "@/lib/types/userTypes"
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next"
import { PromoContext, PromoContextType } from "@/providers/PromoCodeProvider"

type Props = {
    total: number
    ticketsTotal: number
    parkingTotal: number
    exchangeRate: ExchangeRate
    tickets: TicketType[]
    user: UserType
    totalNumberParkingPasses: number
    totalNumberTickets: number
    promoCodes: PromoCode[]
}

export default function ProceedToPayment({ parkingTotal, ticketsTotal, total, exchangeRate, tickets, user, totalNumberParkingPasses, totalNumberTickets, promoCodes }: Props)
{
    const context = useContext<PromoContextType>(PromoContext)
    
    if(!context) return null

    const [discount, setDiscount] = useState(0)
    const [discountValue, setDiscountValue] = useState(0)
    const [promoCode, setPromoCode] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const pathname = usePathname()

    const { t } = useTranslation()

    const router = useRouter()

    const totalValue = useMemo(() => promoCodes.find(pCode => pCode.promo === context.promoCode)?.type === '$' ? total - discount : total * (1 - (discount / 100)), [total, discountValue])

    useEffect(() => {
        context.setPromoCodes(promoCodes)
    }, [])

    const handleBuy = async () => {
        setLoading(true)

        const salesDocument = doc(db,'sales', process.env.NEXT_PUBLIC_SALES_ID!)
        const userDoc = doc(db, 'users', user?.id ?? '')

        const response = await fetch('/api/begin-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount_cents: ((tickets[0].country === 'EGP' ? totalValue * exchangeRate.USDToEGP : tickets[0].country === 'AED' ? totalValue * exchangeRate.USDToAED : totalValue * exchangeRate.USDToSAR) * 100).toString(),
                currency: tickets[0].country,
                items: [...tickets.map(ticket => ({ name: Object.keys(ticket.tickets)[0], amount_cents: (ticket.totalPaid * 100).toString(), "quantity": "1" })), totalNumberParkingPasses ? { name: 'Parking Pass', amount_cents: (parkingTotal * 100).toString(), "quantity": totalNumberParkingPasses.toString() } : null].filter(Boolean),
                user: { first_name: user.firstname, last_name: user.lastname, email: user.email, phone_number: `${user.countryCode}${user.phoneNumber}` }
            })
        }).then(res => res.json())

        setLoading(false)
        
        router.push(response.redirect)

        // await runTransaction(db, async (transaction) => {
        //     const salesDoc = await transaction.get(salesDocument)

        //     await transaction.update(userDoc, { tickets: arrayUnion(...tickets.map(ticket => ticket.id)), cart: { tickets: [], createdAt: null, status: 'pending' } })
        //     await transaction.update(salesDocument, { totalRevenue: salesDoc.data()?.totalRevenue + totalValue, totalTicketsSold: salesDoc.data()?.totalTicketsSold + totalNumberTickets, totalSales: salesDoc.data()?.totalSales + (isNaN(totalNumberTickets) ? 0 : totalNumberTickets) + (isNaN(totalNumberParkingPasses) ? 0 : totalNumberParkingPasses), updatedAt: Timestamp.now() })
        //     if(discount > 0) {
        //         const promoCodesDoc = doc(db, 'promoCodes', promoCodes.find(pCode => pCode.promo === context.promoCode)?.id!)
        //         if(promoCodes.find(pCode => pCode.promo === promoCode)?.quantity === 1) await transaction.delete(promoCodesDoc)
        //         else await transaction.update(promoCodesDoc, { quantity: promoCodes.find(pCode => pCode.promo === context.promoCode)?.quantity! - 1 })
        //     }
        //     const ticketsUpdate = tickets.map(async ticket => await transaction.update(doc(db, 'tickets', ticket.id), { status: 'paid' }))
    
        //     await Promise.all(ticketsUpdate)
        // })

        // setLoading(false)
        // router.push(`/success/${tickets[0].id}`)
    }

    const handlePromoCodeChange = () => {
        const foundPromoCode = promoCodes.find(pCode => pCode.promo === promoCode)
        if(!foundPromoCode) {
            setError('Invalid Promo Code')
            return
        }

        const countryCode = {
            'Egypt': 'EGP',
            'United Arab Emirates': 'AED',
            'Saudi Arabia': 'SAR',
            'All': 'All'
        }

        if(foundPromoCode?.country !== 'All' && countryCode[foundPromoCode?.country as 'Egypt' | 'United Arab Emirates' | 'Saudi Arabia' | 'All'] !== tickets[0].country) {
            setError('Invalid Promo Code')
            return
        }

        const ticketsEvents = tickets.map(ticket => ticket.eventId)

        if(foundPromoCode?.singleEvent)
        {
            if(!ticketsEvents.includes(foundPromoCode.eventID))
            {
                setError('Invalid Promo Code')
                return
            }
            else
            {
                const ticketsCurrency = tickets[0].country
                const exchangeValue = ticketsCurrency === 'EGP' ? exchangeRate.USDToEGP : ticketsCurrency === 'AED' ? exchangeRate.USDToAED : exchangeRate.USDToSAR
                setDiscountValue(foundPromoCode.discount * exchangeValue)
                setDiscount(foundPromoCode?.discount)
                context.setPromoCode(promoCode)
                context.setPromoCodeApplied(true)
            }
        }
        else
        {
            const ticketsCurrency = tickets[0].country
            const exchangeValue = ticketsCurrency === 'EGP' ? exchangeRate.USDToEGP : ticketsCurrency === 'AED' ? exchangeRate.USDToAED : exchangeRate.USDToSAR
            setDiscountValue(foundPromoCode?.discount * exchangeValue)
            setDiscount(foundPromoCode?.discount)
            context.setPromoCode(promoCode)
            context.setPromoCodeApplied(true)
        }
    }

    return (
        <div dir={pathname?.startsWith('/ar') ? 'rtl' : 'ltr'} className='flex flex-col items-center justify-center gap-4 w-full lg:w-screen lg:max-w-[518px]'>
            <p className={cn('font-poppins flex-1 text-white font-light text-sm lg:text-base w-full', pathname?.startsWith('/ar') ? 'text-right' : 'text-left')}>{t('doPromo')}</p>
            <div className='relative flex h-12 lg:h-20 px-4 lg:pl-20 lg:pr-4 items-center justify-center rounded-md bg-white w-full'>
                <input
                    type='text'
                    placeholder={t('promo')}
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    disabled={context.promoCodeApplied}
                    className='text-black outline-none disabled:bg-white placeholder:text-[rgba(0,0,0,0.5)] font-poppins font-light text-xs lg:text-sm flex-1'
                />
                {!context.promoCodeApplied ? (
                    <p onClick={handlePromoCodeChange} className={cn('font-poppins font-light text-xs lg:text-sm underline cursor-pointer', context.promoCode?.length ? 'text-black' : 'text-[rgba(0,0,0,0.5)]')}>{t('applyPromo')}</p>
                ) : (
                    <p 
                        onClick={() => {
                            context.setPromoCode('')
                            context.setPromoCodeApplied(false)
                            setDiscount(0)
                            setDiscountValue(0)
                        }}
                        className={cn('font-poppins font-medium text-xs lg:text-sm underline cursor-pointer', context.promoCode?.length ? 'text-[#ff0000]' : 'text-[rgba(0,0,0,0.5)]')}
                    >
                        {t('cancelPromo')}
                    </p>
                )}
                <p className='absolute -bottom-[0.05rem] left-20 font-poppins font-normal text-xs lg:text-sm text-[rgba(255,0,0,0.5)]'>{error}</p>
            </div>
            <div className='flex flex-col px-4 py-4 items-center justify-center rounded-md bg-white divide-y w-full gap-4'>
                <div className='flex justify-between items-center w-full'>
                    <p className='font-poppins text-black font-semibold text-sm lg:text-base'>{t('total')}</p>
                    <p className='font-poppins text-black font-semibold text-sm lg:text-base'>{discount > 0 && <span className='text-[rgba(255,0,0,0.5)] line-through mr-4'><FormattedPrice price={total} exchangeRate={exchangeRate} /></span>}<FormattedPrice price={totalValue} exchangeRate={exchangeRate} /></p>
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
                        <p className='font-poppins text-[rgba(0,0,0,0.5)] font-normal text-xs lg:text-md'><FormattedPrice price={promoCodes.find(pCode => pCode.promo === context.promoCode)?.type === '$' ? discount : total - totalValue} exchangeRate={exchangeRate} /></p>
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