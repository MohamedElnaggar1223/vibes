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
    const [isFlipped, setIsFlipped] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [currentWidth, setCurrentWidth] = useState<number>()

    useEffect(() => {
        if(window) setCurrentWidth(window?.innerWidth!)
    }, [])
    
    const mainRef = useRef<HTMLDivElement>(null)

    const handleFlip = () => {
        setClicked(true)
        if(!isAnimating && (currentWidth ?? 0) < 1536)
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
            <div onClick={handleFlip} className='absolute rounded-lg flex w-full max-2xl:min-h-64 h-auto max-2xl:max-h-64 2xl:min-h-44 2xl:max-h-44 p-0 2xl:overflow-hidden gap-8 flipCardInner'>
                <motion.div 
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 360 }}
                    transition={{ duration: 0.6 }}
                    onAnimationComplete={() => setIsAnimating(false)}
                    ref={mainRef}
                    className={cn('flex max-2xl:flex-col max-2xl:min-h-64 gap-2 2xl:gap-8 items-center justify-between w-full h-full flipCard bg-[rgba(217,217,217,0.2)] rounded-lg flipCardInner', !clicked && first && (currentWidth ?? 0) < 1536 && 'animate-semiFlip')}
                >
                    <div className='2xl:flex-1 flex items-start max-2xl:w-full 2xl:items-center justify-start gap-2 2xl:gap-8'>
                        <Image
                            src={event.displayPageImage}
                            height={176}
                            width={176}
                            alt={event.name}
                            className='max-2xl:max-w-28 2xl:min-w-44 2xl:min-h-44 2xl:h-full object-fill rounded-lg'
                        />
                        <div className='flex flex-col gap-3 py-2 max-2xl:flex-1'>
                            <p className='font-poppins font-bold text-base 2xl:text-2xl text-white'>{event.name}</p>
                            <p className='font-poppins text-[0.6rem] leading-[1rem] 2xl:text-base font-extralight text-white'>{`${months[event.eventDate?.getMonth()]}, ${getDaySuffix(event.eventDate?.getDate())}, ${event.eventDate?.getFullYear()}`} | {formatTime(event.eventTime)} {event.timeZone}</p>
                            <div className='w-full flex 2xl:justify-between items-center gap-0.5 2xl:gap-6 max-2xl:flex-wrap'>
                                <p className='font-poppins text-[0.6rem] max-2xl:leading-[1rem] 2xl:text-base font-extralight text-white'>{event?.venue} <span className='2xl:hidden font-poppins text-[0.6rem] leading-[1rem] 2xl:text-base font-extralight text-white'>|</span></p>
                                <p className='font-poppins text-[0.6rem] max-2xl:leading-[1rem] 2xl:text-base font-extralight text-white max-2xl:hidden'>|</p>
                                <p className='font-poppins text-[0.6rem] max-2xl:leading-[1rem] 2xl:text-base font-extralight text-white'>{event?.city}, {event?.country}</p>
                            </div>
                            <p className='font-poppins text-[0.6rem] leading-[1rem] 2xl:text-base font-extralight text-white whitespace-break-spaces'>{event.gatesOpen && `Gates open ${formatTime(event.gatesOpen)}`} {event.gatesClose && `| Gates close ${formatTime(event.gatesClose)}`}</p>
                        </div>
                    </div>
                    <Separator className='w-[90%] 2xl:hidden h-[1px]' />
                    <div className='flex gap-4 items-center justify-between max-2xl:px-12 max-2xl:mt-4 max-2xl:mb-auto max-2xl:w-full 2xl:max-h-full'>
                        <div className='flex 2xl:w-24 flex-col mr-auto text-left gap-0.5 2xl:gap-3 2xl:pb-4 2xl:pt-10 h-full w-fit text-nowrap'>
                            {Object.keys(ticket.tickets).slice().filter(ticketKey => ticket.tickets[ticketKey] > 0).map((ticketKey, index) => <p key={index} className='font-poppins text-[0.6rem] max-2xl:leading-[1rem] 2xl:text-base font-normal text-white'>{ticketKey} <span className='font-extralight ml-2 max-2xl:hidden'>x{ticket.tickets[ticketKey]}</span></p>)}
                            {ticket.parkingPass > 0 && <p className='font-poppins text-[0.6rem] max-2xl:leading-[1rem] 2xl:text-base font-normal text-white'>Parking Pass <span className='font-extralight ml-2 max-2xl:hidden'>x{ticket.parkingPass}</span></p>}
                        </div>
                        <div className='flex h-full items-center justify-center qrcodeHeight max-2xl:hidden'>
                            {/* <QrCode values="sadawddwadaw" /> */}
                            <QRCode value={ticket.id} height='90%' />
                        </div>
                        <div className='2xl:hidden flex text-right flex-col h-full w-fit text-nowrap'>
                            {Object.keys(ticket.tickets).slice().filter(ticketKey => ticket.tickets[ticketKey] > 0).map((ticketKey, index) => <p key={index} className='font-poppins text-[0.6rem] max-2xl:leading-[1rem] 2xl:text-base font-normal text-white'><span className='font-extralight ml-2'>x{ticket.tickets[ticketKey]}</span></p>)}
                            {ticket.parkingPass > 0 && <span className='font-extralight ml-2 font-poppins text-[0.6rem] max-2xl:leading-[1rem] 2xl:text-base text-white'>x{ticket.parkingPass}</span>}
                        </div>
                    </div>
                    {
                        (currentWidth ?? 0) < 1536 && (
                            <motion.div style={{ minHeight: `${mainRef.current?.offsetHeight}px` }} className='absolute flipCard flipCardBack flex max-2xl:flex-col gap-2 2xl:gap-8 items-center justify-center w-full min-h-full flipCard bg-[rgba(217,217,217,0.2)] rounded-lg'>
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