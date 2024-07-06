'use client'

import { months } from "@/constants"
import { db } from "@/firebase/client/config"
import { EventType, ExchangeRate } from "@/lib/types/eventTypes"
import { TicketType } from "@/lib/types/ticketTypes"
import { toArabicDate, getDaySuffix, toArabicTime, formatTime, toArabicNums } from "@/lib/utils"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useCallback, useContext, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import FormattedPrice from "./FormattedPrice"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { deleteDoc, doc, runTransaction, updateDoc } from "firebase/firestore"
import { UserType } from "@/lib/types/userTypes"
import { Dialog, DialogContent } from "../ui/dialog"
import { PromoContextType, PromoContext } from "@/providers/PromoCodeProvider"

type Props = {
    ticket: TicketType
    event: EventType
    exchangeRate: ExchangeRate
    user: UserType
}

export default function CartTicket({ user, ticket, event, exchangeRate }: Props) 
{
    const context = useContext<PromoContextType>(PromoContext)
    
    if(!context) return null

    const pathname = usePathname()
    const router = useRouter()

    const { t } = useTranslation()

    const [loading, setLoading] = useState(false)
    const [discounted, setDiscounted] = useState(false)

    const handleDelete = async () => {
        setLoading(true)

        const newEventTickets = event?.tickets.map(eventTicket => {
            const foundTicket = Object.keys(ticket.tickets).find(key => key === eventTicket.name)
            if (foundTicket) {
                return {...eventTicket, quantity: eventTicket.quantity + ticket.tickets[foundTicket]}
            }
            return eventTicket
        })

        const newEventSeats = {...event.seatPattern, ...ticket.seats}

        const eventDoc = doc(db, 'events', event.id)
        const ticketDoc = doc(db, 'tickets', ticket.id)
        const userDoc = doc(db, 'users', user.id!)

        await runTransaction(db, async (transaction) => {
            await transaction.update(eventDoc, { tickets: newEventTickets!, seatPattern: newEventSeats})
            await transaction.update(userDoc, { cart: { ...user.cart, tickets: user.cart?.tickets.slice().filter(id => id !== ticket.id) } })
            await transaction.delete(ticketDoc)
        })


        setLoading(false)
        router.refresh()
    }

    // const ticketPrice = useMemo(() => {
    //     if(context.promoCodeApplied) {
    //         const promoCode = context.promoCodes?.find(promoCode => promoCode.promo === context.promoCode)

    //         if(promoCode?.singleEvent && promoCode?.eventID === event.id) {
    //             if(promoCode?.type === '$') {
    //                 // return (ticket.totalPaid - promoCode?.discount) / Object.values(ticket.tickets as Object)?.reduce((total: any, ticket: any) => total + ticket, 0)
    //                 const eventTicketPrice = event.tickets.find(eventTicket => eventTicket.name === key)?.price
    //             } else {
    //                 return (ticket.totalPaid - (ticket.totalPaid * (promoCode?.discount / 100))) / Object.values(ticket.tickets as Object)?.reduce((total: any, ticket: any) => total + ticket, 0)
    //             }
    //         } else if(!promoCode?.singleEvent) {
    //             if(promoCode?.type === '$') {
    //                 return (ticket.totalPaid - promoCode?.discount) / Object.values(ticket.tickets as Object)?.reduce((total: any, ticket: any) => total + ticket, 0)
    //             } else {
    //                 return (ticket.totalPaid - (ticket.totalPaid * (promoCode?.discount! / 100))) / Object.values(ticket.tickets as Object)?.reduce((total: any, ticket: any) => total + ticket, 0)
    //             }
    //         }
    //     }
    //     else return ticket.totalPaid / Object.values(ticket.tickets as Object)?.reduce((total: any, ticket: any) => total + ticket, 0)
    // }, [context])

    const findTicketPrice = useCallback((key: string) => {
        const ticketPrice = event.tickets.find(eventTicket => eventTicket.name === key)?.price
        if(context.promoCodeApplied) {
            const promoCode = context.promoCodes?.find(promoCode => promoCode.promo === context.promoCode)
            const discountPerTicket = promoCode?.discount! / ticket.tickets[key]

            console.log(discountPerTicket)

            if(promoCode?.singleEvent && promoCode?.eventID === event.id) {
                if(promoCode?.type === '$') {
                    return (ticketPrice! - discountPerTicket)
                } else {
                    return (ticketPrice! - (ticketPrice! * (promoCode?.discount / 100)))
                }
            } else if(!promoCode?.singleEvent) {
                if(promoCode?.type === '$') {
                    return (ticketPrice! - discountPerTicket)
                } else {
                    return (ticketPrice! - (ticketPrice! * (promoCode?.discount! / 100)))
                }
            }
            else return ticketPrice
        }
        else return ticketPrice
    }, [context])

    return (
        <AnimatePresence>
            <motion.div layoutId={ticket.id} dir={pathname?.startsWith('/ar') ? 'rtl' : 'ltr'} className='flex flex-col w-full'>
                <div className='flex items-center justify-start px-3 py-2 gap-4'>
                    <Image 
                        src={event.displayPageImage}
                        width={96}
                        height={96}
                        alt={event.name}
                        className='rounded-md max-lg:min-w-20 max-lg:min-h-20'
                    />
                    <div className='flex flex-col justify-evenly items-start'>
                        <p className='font-poppins text-white font-medium text-sm lg:text-base'>{pathname?.startsWith('/ar') ? event.nameArabic : event.name}</p>
                        <div className='flex gap-12'>
                            <p className='font-poppins text-[0.6rem] leading-[1rem] xl:text-xs font-thin text-white'>{pathname?.startsWith('/ar') ? toArabicDate(`${months[event.eventDate?.getMonth()]}, ${getDaySuffix(event.eventDate?.getDate())}, ${event.eventDate?.getFullYear()}`) : `${months[event.eventDate?.getMonth()]}, ${getDaySuffix(event.eventDate?.getDate())}, ${event.eventDate?.getFullYear()}`} | {pathname?.startsWith('/ar') ? toArabicTime(formatTime(event.eventTime)) : formatTime(event.eventTime)} {event.timeZone}</p>
                            <div className='w-full flex items-center gap-1.5 max-xl:flex-wrap'>
                                <p className='font-poppins text-[0.6rem] max-xl:leading-[1rem] text-nowrap xl:text-xs font-thin text-white'>{pathname?.startsWith('/ar') ? event.venueArabic : event?.venue} <span className='xl:hidden font-poppins text-[0.6rem] leading-[1rem] xl:text-xs font-thin text-white'>|</span></p>
                                <p className='font-poppins text-[0.6rem] max-xl:leading-[1rem] text-nowrap xl:text-xs font-thin text-white max-xl:hidden'>|</p>
                                <p className='font-poppins text-[0.6rem] max-xl:leading-[1rem] text-nowrap xl:text-xs font-thin text-white'>{pathname?.startsWith('/ar') ? event.cityArabic : event?.city}, {t(`${event?.country.replaceAll(" ", "")}`)}</p>
                            </div>
                        </div>
                    </div>
                    <Trash2 onClick={handleDelete} className='ml-auto mr-2 cursor-pointer' stroke="#f0f0f0" size='22' />
                </div>
                {Object.keys(ticket.tickets).slice().filter(key => ticket.tickets[key] !== 0).map(key => (
                    <div key={key} className='flex items-center justify-between px-12 bg-[rgba(0,0,0,0.4)] my-1 py-4 gap-4'>
                        <p className='font-poppins flex-1 text-center text-white text-nowrap font-light text-xs lg:text-base'>{pathname?.startsWith('/ar') ? event.tickets.find(ticket => ticket.name === key)?.nameArabic : key}</p>
                        <p className='font-poppins flex-1 text-center text-white text-nowrap font-light text-xs lg:text-base'>x{pathname?.startsWith('/ar') ? toArabicNums(`${ticket.tickets[key]}`) : ticket.tickets[key]}</p>
                        <p className='font-poppins flex-1 text-center text-white text-nowrap font-light text-xs lg:text-base'>{findTicketPrice(key) !== event.tickets.find(eventTicket => eventTicket.name === key)?.price && <span className='text-gray-600 line-through mr-4'><FormattedPrice price={event.tickets.find(eventTicket => eventTicket.name === key)?.price!} exchangeRate={exchangeRate} currency={ticket.country} /></span>}<FormattedPrice price={findTicketPrice(key)!} exchangeRate={exchangeRate} currency={ticket.country} /></p>
                        {/* <p className='font-poppins flex-1 text-center text-white font-light text-xs lg:text-base'><FormattedPrice price={event.tickets.find(eventTicket => eventTicket.name === key)?.price!} exchangeRate={exchangeRate} currency={ticket.country} /></p> */}
                    </div>
                ))}
                {ticket.parkingPass > 0 && (
                    <div className='flex items-center justify-between px-12 bg-[rgba(0,0,0,0.4)] my-1 py-4 gap-4'>
                        <p className='font-poppins flex-1 text-center text-white text-nowrap font-light text-xs lg:text-base'>{t('parkingPass')}</p>
                        <p className='font-poppins flex-1 text-center text-white text-nowrap font-light text-xs lg:text-base'>x{pathname?.startsWith('/ar') ? toArabicNums(`${ticket.parkingPass}`) : ticket.parkingPass}</p>
                        <p className='font-poppins flex-1 text-center text-white text-nowrap font-light text-xs lg:text-base'><FormattedPrice price={event.parkingPass.price!} exchangeRate={exchangeRate} currency={ticket.country} /></p>
                    </div>
                )}
                {Object.keys(ticket.seats).length > 0 && Object.keys(ticket.seats).map(seat => {
                    const seatData = seat.split("_")
                    const seatType = seatData[0]
                    const seatRow = seatData[1].split("-")[1]
                    const seatNumber = seatData[2].split("-")[1]

                    return (
                        <div className='flex items-center justify-between px-12 bg-[rgba(0,0,0,0.4)] my-1 py-4 gap-4'>
                            <p className='font-poppins flex-1 text-center text-white font-light text-nowrap text-xs lg:text-base'>{seatType}</p>
                            <p className='font-poppins flex-1 text-center text-white font-light text-nowrap text-xs lg:text-base'>Row: {seatRow}</p>
                            <p className='font-poppins flex-1 text-center text-white font-light text-nowrap text-xs lg:text-base'>Number: {seatNumber}</p>
                        </div>
                    )
                })}
            </motion.div>
            <Dialog open={loading}>
                <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                    <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                </DialogContent>
            </Dialog>
        </AnimatePresence>
    )
}