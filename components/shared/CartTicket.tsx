'use client'

import { months } from "@/constants"
import { db } from "@/firebase/client/config"
import { EventType, ExchangeRate } from "@/lib/types/eventTypes"
import { TicketType } from "@/lib/types/ticketTypes"
import { toArabicDate, getDaySuffix, toArabicTime, formatTime } from "@/lib/utils"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import FormattedPrice from "./FormattedPrice"
import { AnimatePresence, motion } from "framer-motion"

type Props = {
    ticket: TicketType
    event: EventType
    exchangeRate: ExchangeRate
}

export default function CartTicket({ ticket, event, exchangeRate }: Props) 
{
    const pathname = usePathname()
    const { t } = useTranslation()

    console.log()

    return (
        <AnimatePresence>
            <motion.div layoutId={ticket.id} className='flex flex-col w-full'>
                <div className='flex items-center justify-start px-3 py-2 gap-4'>
                    <Image 
                        src={event.displayPageImage}
                        width={70}
                        height={70}
                        alt={event.name}
                        className='rounded-md'
                    />
                    <div className='flex flex-col justify-evenly items-start'>
                        <p className='font-poppins text-white font-medium text-base'>{event.name}</p>
                        <div className='flex gap-12'>
                            <p className='font-poppins text-xs leading-[1rem] xl:text-xs font-thin text-white'>{pathname?.startsWith('/ar') ? toArabicDate(`${months[event.eventDate?.getMonth()]}, ${getDaySuffix(event.eventDate?.getDate())}, ${event.eventDate?.getFullYear()}`) : `${months[event.eventDate?.getMonth()]}, ${getDaySuffix(event.eventDate?.getDate())}, ${event.eventDate?.getFullYear()}`} | {pathname?.startsWith('/ar') ? toArabicTime(formatTime(event.eventTime)) : formatTime(event.eventTime)} {event.timeZone}</p>
                            <div className='w-full flex items-center gap-1.5 max-xl:flex-wrap'>
                                <p className='font-poppins text-xs max-xl:leading-[1rem] xl:text-xs font-thin text-white'>{pathname?.startsWith('/ar') ? event.venueArabic : event?.venue} <span className='xl:hidden font-poppins text-xs leading-[1rem] xl:text-xs font-thin text-white'>|</span></p>
                                <p className='font-poppins text-xs max-xl:leading-[1rem] xl:text-xs font-thin text-white max-xl:hidden'>|</p>
                                <p className='font-poppins text-xs max-xl:leading-[1rem] xl:text-xs font-thin text-white'>{pathname?.startsWith('/ar') ? event.cityArabic : event?.city}, {t(`${event?.country.replaceAll(" ", "")}`)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {Object.keys(ticket.tickets).slice().filter(key => ticket.tickets[key] !== 0).map(key => (
                    <div key={key} className='flex items-center justify-between px-12 bg-[rgba(0,0,0,0.4)] my-1 py-4 gap-4'>
                        <p className='font-poppins flex-1 text-center text-white font-light text-base'>{t(key)}</p>
                        <p className='font-poppins flex-1 text-center text-white font-light text-base'>x{ticket.tickets[key]}</p>
                        <p className='font-poppins flex-1 text-center text-white font-light text-base'><FormattedPrice price={event.tickets.find(eventTicket => eventTicket.name === key)?.price!} exchangeRate={exchangeRate} currency={ticket.country} /></p>
                    </div>
                ))}
                {ticket.parkingPass > 0 && (
                    <div className='flex items-center justify-between px-12 bg-[rgba(0,0,0,0.4)] my-1 py-4 gap-4'>
                        <p className='font-poppins flex-1 text-center text-white font-light text-base'>{t('parkingPass')}</p>
                        <p className='font-poppins flex-1 text-center text-white font-light text-base'>x{ticket.parkingPass}</p>
                        <p className='font-poppins flex-1 text-center text-white font-light text-base'><FormattedPrice price={event.parkingPass.price!} exchangeRate={exchangeRate} currency={ticket.country} /></p>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}