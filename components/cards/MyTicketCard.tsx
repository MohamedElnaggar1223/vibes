'use client'
import { months } from "@/constants"
import { EventType } from "@/lib/types/eventTypes"
import { TicketType } from "@/lib/types/ticketTypes"
import { getDaySuffix, formatTime, cn } from "@/lib/utils"
// import { QrCode } from "lucide-react"
import QRCode from "react-qr-code"
import Image from "next/image"
import { Separator } from "../ui/separator"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

type Props = {
    ticket: TicketType,
    event: EventType,
    first: boolean
}

export default function MyTicketCard({ ticket, event, first }: Props)
{
    const [currentWidth, setCurrentWidth] = useState(window?.innerWidth!)
    const [isFlipped, setIsFlipped] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [clicked, setClicked] = useState(false)
    
    const mainRef = useRef<HTMLDivElement>(null)

    const handleFlip = () => {
        setClicked(true)
        if(!isAnimating && currentWidth < 1024)
        {
            setIsFlipped(prev => !prev)
            setIsAnimating(true)
        }
    }

    useEffect(() => {
        const handleResize = () => setCurrentWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <AnimatePresence>
            <div onClick={handleFlip} className='absolute rounded-lg flex w-full max-lg:min-h-64 h-auto max-lg:max-h-64 lg:min-h-44 lg:max-h-44 p-0 lg:overflow-hidden gap-8 flipCardInner'>
                <motion.div 
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 360 }}
                    transition={{ duration: 0.6 }}
                    onAnimationComplete={() => setIsAnimating(false)}
                    ref={mainRef}
                    className={cn('flex max-lg:flex-col max-lg:min-h-64 gap-2 lg:gap-8 items-center justify-between w-full h-full flipCard bg-[rgba(217,217,217,0.2)] rounded-lg flipCardInner', !clicked && first && currentWidth < 1024 && 'animate-semiFlip')}
                >
                    <div className='lg:flex-1 flex items-start max-lg:w-full lg:items-center justify-start gap-2 lg:gap-8'>
                        <Image
                            src={event.displayPageImage}
                            height={176}
                            width={176}
                            alt={event.name}
                            className='max-lg:max-w-28 lg:min-w-44 lg:min-h-44 lg:h-full object-fill rounded-lg'
                        />
                        <div className='flex flex-col gap-3 py-2 max-lg:flex-1'>
                            <p className='font-poppins font-bold text-sm lg:text-2xl text-white'>{event.name}</p>
                            <p className='font-poppins text-[0.6rem] leading-[1rem] lg:text-base font-extralight text-white'>{`${months[event.eventDate?.getMonth()]}, ${getDaySuffix(event.eventDate?.getDate())}, ${event.eventDate?.getFullYear()}`} | {formatTime(event.eventTime)} {event.timeZone}</p>
                            <div className='w-full flex lg:justify-between items-center gap-0.5 lg:gap-6 max-lg:flex-wrap'>
                                <p className='font-poppins text-[0.6rem] max-lg:leading-[1rem] lg:text-base font-extralight text-white'>{event?.venue} <span className='lg:hidden font-poppins text-[0.6rem] leading-[1rem] lg:text-base font-extralight text-white'>|</span></p>
                                <p className='font-poppins text-[0.6rem] max-lg:leading-[1rem] lg:text-base font-extralight text-white max-lg:hidden'>|</p>
                                <p className='font-poppins text-[0.6rem] max-lg:leading-[1rem] lg:text-base font-extralight text-white'>{event?.city}, {event?.country}</p>
                            </div>
                            <p className='font-poppins text-[0.6rem] leading-[1rem] lg:text-base font-extralight text-white whitespace-break-spaces'>{event.gatesOpen && `Gates open ${formatTime(event.gatesOpen)}`} {event.gatesClose && `| Gates close ${formatTime(event.gatesClose)}`}</p>
                        </div>
                    </div>
                    <Separator className='w-[90%] lg:hidden h-[1px]' />
                    <div className='flex gap-8 items-center justify-between max-lg:px-12 max-lg:mt-4 max-lg:mb-auto max-lg:w-full lg:max-h-full'>
                        <div className='flex lg:w-24 flex-col mr-auto text-left gap-0.5 lg:gap-3 lg:pb-4 lg:pt-10 h-full w-fit text-nowrap'>
                            {Object.keys(ticket.tickets).slice().filter(ticketKey => ticket.tickets[ticketKey] > 0).map(ticketKey => <p className='font-poppins text-[0.6rem] max-lg:leading-[1rem] lg:text-base font-normal text-white'>{ticketKey} <span className='font-extralight ml-2 max-lg:hidden'>x{ticket.tickets[ticketKey]}</span></p>)}
                            {ticket.parkingPass > 0 && <p className='font-poppins text-[0.6rem] max-lg:leading-[1rem] lg:text-base font-normal text-white'>Parking Pass <span className='font-extralight ml-2 max-lg:hidden'>x{ticket.parkingPass}</span></p>}
                        </div>
                        <div className='flex h-full items-center justify-center qrcodeHeight max-lg:hidden'>
                            {/* <QrCode values="sadawddwadaw" /> */}
                            <QRCode value={ticket.id} height='90%' />
                        </div>
                        <div className='lg:hidden flex text-right flex-col h-full w-fit text-nowrap'>
                            {Object.keys(ticket.tickets).slice().filter(ticketKey => ticket.tickets[ticketKey] > 0).map(ticketKey => <p className='font-poppins text-[0.6rem] max-lg:leading-[1rem] lg:text-base font-normal text-white'><span className='font-extralight ml-2'>x{ticket.tickets[ticketKey]}</span></p>)}
                            {ticket.parkingPass > 0 && <span className='font-extralight ml-2 font-poppins text-[0.6rem] max-lg:leading-[1rem] lg:text-base text-white'>x{ticket.parkingPass}</span>}
                        </div>
                    </div>
                    {
                        currentWidth < 1024 && (
                            <motion.div style={{ minHeight: `${mainRef.current?.offsetHeight}px` }} className='absolute flipCard flipCardBack flex max-lg:flex-col gap-2 lg:gap-8 items-center justify-center w-full min-h-full flipCard bg-[rgba(217,217,217,0.2)] rounded-lg'>
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