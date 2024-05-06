'use client'
import { months } from "@/constants"
import { EventType } from "@/lib/types/eventTypes"
import { TicketType } from "@/lib/types/ticketTypes"
import { getDaySuffix, formatTime, cn, toArabicDate, toArabicTime, toArabicNums } from "@/lib/utils"
// import { QrCode } from "lucide-react"
import QRCode from "react-qr-code"
import Image from "next/image"
import { Separator } from "../ui/separator"
import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LucideChevronDown } from 'lucide-react'
import { usePathname, useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"

type Props = {
    ticket: TicketType,
    event: EventType,
    first: boolean
}

export default function MyTicketCard({ ticket, event, first }: Props)
{
    const [isFlipped, setIsFlipped] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [currentWidth, setCurrentWidth] = useState<number>()
    const [scrolled, setScrolled] = useState(false)

    const pathname = usePathname()
    const searchParams = useSearchParams()

    const id = searchParams?.get('id')

    const { t } = useTranslation()

    const infoRef = useRef<HTMLDivElement>(null)
    const infoRefScrollable = useMemo(() => {
        if(infoRef.current) return infoRef.current.scrollHeight > infoRef.current.clientHeight
        return false
    }, [infoRef])

    useEffect(() => {
        const handleScroll = () => {
            const element = infoRef.current
            if (element) {
                setScrolled(
                    element.scrollHeight - element.scrollTop === element.clientHeight
                )
            }
        }

        const element = infoRef.current
        if (element) {
            element.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (element) {
                element.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])

    useEffect(() => {
        if(window) setCurrentWidth(window?.innerWidth!)
    }, [])
    
    const mainRef = useRef<HTMLDivElement>(null)

    const handleFlip = () => {
        setClicked(true)
        if(!isAnimating && (currentWidth ?? 0) < 1024)
        {
            setIsFlipped(prev => !prev)
            setIsAnimating(true)
        }
    }

    useEffect(() => {
        if(typeof id === 'string' && id === ticket.id) mainRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [id])

    useEffect(() => {
        const handleResize = () => setCurrentWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <AnimatePresence>
            <div onClick={handleFlip} className='absolute rounded-lg flex w-full max-xl:min-h-64 h-auto max-xl:max-h-64 xl:min-h-48 xl:max-h-48 p-0 xl:overflow-hidden gap-8 flipCardInner'>
                <motion.div 
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 360 }}
                    transition={{ duration: 0.6 }}
                    onAnimationComplete={() => setIsAnimating(false)}
                    ref={mainRef}
                    className={cn('flex max-xl:flex-col max-xl:min-h-64 gap-2 xl:gap-8 items-center justify-between w-full h-full flipCard bg-[rgba(217,217,217,0.2)] rounded-lg flipCardInner', !clicked && first && (currentWidth ?? 0) < 1024 && 'animate-semiFlip')}
                >
                    <div className='xl:flex-1 flex items-start max-xl:w-full xl:items-center justify-start gap-2 xl:gap-8'>
                        <Image
                            src={event.displayPageImage}
                            height={176}
                            width={176}
                            alt={event.name}
                            className='max-xl:max-w-28 xl:min-w-48 xl:min-h-48 xl:h-full object-fill rounded-lg'
                        />
                        <div ref={infoRef} className='info relative flex flex-col gap-3 py-2 max-xl:flex-1 xl:max-h-48 overflow-auto'>
                            <p className='font-poppins font-bold text-base xl:text-xl text-white'>{pathname?.startsWith('/ar') ? event.nameArabic : event.name}</p>
                            <p className='font-poppins text-[0.6rem] leading-[1rem] xl:text-sm font-extralight text-white'>{pathname?.startsWith('/ar') ? toArabicDate(`${months[event.eventDate?.getMonth()]}, ${getDaySuffix(event.eventDate?.getDate())}, ${event.eventDate?.getFullYear()}`) : `${months[event.eventDate?.getMonth()]}, ${getDaySuffix(event.eventDate?.getDate())}, ${event.eventDate?.getFullYear()}`} | {pathname?.startsWith('/ar') ? toArabicTime(formatTime(event.eventTime)) : formatTime(event.eventTime)} {event.timeZone}</p>
                            <div className='w-full flex xl:justify-between items-center gap-0.5 xl:gap-6 max-xl:flex-wrap'>
                                <p className='font-poppins text-[0.6rem] max-xl:leading-[1rem] xl:text-sm font-extralight text-white'>{pathname?.startsWith('/ar') ? event.venueArabic : event?.venue} <span className='xl:hidden font-poppins text-[0.6rem] leading-[1rem] xl:text-sm font-extralight text-white'>|</span></p>
                                <p className='font-poppins text-[0.6rem] max-xl:leading-[1rem] xl:text-sm font-extralight text-white max-xl:hidden'>|</p>
                                <p className='font-poppins text-[0.6rem] max-xl:leading-[1rem] xl:text-sm font-extralight text-white'>{pathname?.startsWith('/ar') ? event.cityArabic : event?.city}, {t(`${event?.country.replaceAll(" ", "")}`)}</p>
                            </div>
                            <p className='font-poppins text-[0.6rem] leading-[1rem] xl:text-sm font-extralight text-white whitespace-break-spaces'>{event.gatesOpen && `${t('gatesOpen')} ${pathname?.startsWith('/ar') ? toArabicTime(formatTime(event.gatesOpen)) : formatTime(event.gatesOpen)}`} {event.gatesClose && `| ${t('gatesClose')} ${pathname?.startsWith('/ar') ? toArabicTime(formatTime(event.gatesClose)) : formatTime(event.gatesClose)}`}</p>
                            {
                                infoRefScrollable && !scrolled &&
                                <div 
                                    onClick={() => {
                                        const element = infoRef.current;
                                        if (element) {
                                            element.scrollTo({
                                                top: element.scrollHeight,
                                                behavior: 'smooth' // Enable smooth scrolling behavior
                                            });
                                        }
                                    }} 
                                    className='cursor-pointer fixed flex items-center justify-center p-[0.1rem] rounded-full border-[2px] min-w-5 min-h-5 max-w-5 max-h-5' style={{ top: `${(infoRef.current?.clientHeight ?? 10) - 30}px`, right: `${(infoRef.current?.clientWidth ?? 100) + 75}px` }}
                                >
                                    <LucideChevronDown className='text-white w-5 min-h-5' />
                                </div>
                            }
                        </div>
                    </div>
                    <Separator className='w-[90%] xl:hidden h-[1px]' />
                    <div className='flex gap-4 items-center justify-between max-xl:px-12 max-xl:mt-4 max-xl:mb-auto max-xl:w-full xl:max-h-full'>
                        <div className='flex xl:w-24 flex-col mr-auto text-left gap-0.5 xl:gap-3 xl:pb-4 xl:pt-10 h-full w-fit text-nowrap'>
                            {Object.keys(ticket.tickets).slice().filter(ticketKey => ticket.tickets[ticketKey] > 0).map((ticketKey, index) => <p key={index} className='font-poppins text-[0.6rem] max-xl:leading-[1rem] xl:text-base font-normal text-white'>{pathname?.startsWith('/ar') ? event.tickets.find(t => t.name.toLowerCase() === ticketKey.toLowerCase())?.nameArabic : ticketKey} <span className='font-extralight ml-2 max-xl:hidden'>x{pathname?.startsWith('/ar') ? toArabicNums(`${ticket.tickets[ticketKey]}`) : ticket.tickets[ticketKey]}</span></p>)}
                            {ticket.parkingPass > 0 && <p className='font-poppins text-[0.6rem] max-xl:leading-[1rem] xl:text-base font-normal text-white'>{t('parkingPass')} <span className='font-extralight ml-2 max-xl:hidden'>x{ticket.parkingPass}</span></p>}
                        </div>
                        <div className='flex h-full items-center justify-center qrcodeHeight max-xl:hidden'>
                            {/* <QrCode values="sadawddwadaw" /> */}
                            <QRCode value={ticket.id} height='90%' />
                        </div>
                        <div className='xl:hidden flex text-right flex-col h-full w-fit text-nowrap'>
                            {Object.keys(ticket.tickets).slice().filter(ticketKey => ticket.tickets[ticketKey] > 0).map((ticketKey, index) => <p key={index} className='font-poppins text-[0.6rem] max-xl:leading-[1rem] xl:text-base font-normal text-white'><span className='font-extralight ml-2'>x{pathname?.startsWith('/ar') ? toArabicNums(`${ticket.tickets[ticketKey]}`) : ticket.tickets[ticketKey]}</span></p>)}
                            {ticket.parkingPass > 0 && <span className='font-extralight ml-2 font-poppins text-[0.6rem] max-xl:leading-[1rem] xl:text-base text-white'>x{pathname?.startsWith('/ar') ? toArabicNums(`${ticket.parkingPass}`) : ticket.parkingPass}</span>}
                        </div>
                    </div>
                    {
                        (currentWidth ?? 0) < 1536 && (
                            <motion.div style={{ minHeight: `${mainRef.current?.offsetHeight}px` }} className='absolute flipCard flipCardBack flex max-xl:flex-col gap-2 xl:gap-8 items-center justify-center w-full min-h-full flipCard bg-[rgba(217,217,217,0.2)] rounded-lg'>
                                <div className='flex items-center justify-center qrcodeHeight w-full'>
                                    {/* <QrCode values="sadawddwadaw" /> */}
                                    <QRCode value={ticket.id} height='90%' />
                                </div>
                            </motion.div>
                        )
                    }
                </motion.div>
            </div>
        </AnimatePresence>
    )
}