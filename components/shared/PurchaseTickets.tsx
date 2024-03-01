'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import {
    Dialog,
    DialogContent,
  } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import FormattedPrice from "./FormattedPrice"
import { EventType, ExchangeRate } from "@/lib/types/eventTypes"
import { UserType } from "@/lib/types/userTypes"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/firebase/client/config"

type Props = {
    event: EventType,
    exchangeRate: ExchangeRate,
    user: UserType | null
}

export default function PurchaseTickets({ event, exchangeRate, user }: Props) 
{
    const [dialogOpen, setDialogOpen] = useState(false)
    const [eventData, setEventData] = useState(event)
    const availableTickets = useMemo(() => {
        return eventData.tickets
    }, [eventData])
    const availableParkingPasses = useMemo(() => {
        return eventData.parkingPass
    }, [eventData])
    const [selectedTickets, setSelectedTickets] = useState(availableTickets.reduce((acc, ticket) => ({...acc, [ticket.name]: 0 }), {} as { [x: string]: number }))
    const [purchasedTickets, setPurchasedTickets] = useState({} as { [x: string]: number })
    const [purchasedParkingPass, setPurchasedParkingPass] = useState(0)
    const [fakeLoading, setFakeLoading] = useState(false)
    const [maxHeight, setMaxHeight] = useState(0)

    const parentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMaxHeight(parentRef.current?.offsetHeight || 0)
    }, [])

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'events', event.id), (snapshot) => {
            setEventData(snapshot.data() as EventType)
        })

        return () => {
            unsub()
        }
    }, [])

    useEffect(() => {
        availableTickets.forEach(ticket => {
            if (selectedTickets[ticket.name] > ticket.quantity) {
                setSelectedTickets(prevState => ({...prevState, [ticket.name]: ticket.quantity }))
            }
            if (purchasedTickets[ticket.name] > ticket.quantity) {
                setPurchasedTickets(prevState => ({...prevState, [ticket.name]: ticket.quantity }))
            }
        })
    }, [availableTickets])

    useEffect(() => {
        if(availableParkingPasses.quantity < purchasedParkingPass) setPurchasedParkingPass(availableParkingPasses.quantity)
    }, [availableParkingPasses])

    useEffect(() => {
        const tempRef = parentRef.current

        window.addEventListener('resize', () => {
            setMaxHeight(tempRef?.offsetHeight || 0)
        })

        return () => {
            window.removeEventListener('resize', () => {
                setMaxHeight(tempRef?.offsetHeight || 0)
            })
        }
    }, [])

    const total = useMemo(() => {
        return Object.keys(purchasedTickets).reduce((acc, ticket) => acc + purchasedTickets[ticket] * parseInt(availableTickets.find(availableTicket => availableTicket.name === ticket)?.price.toString() || '0'), 0) + purchasedParkingPass * (availableParkingPasses.price ?? 0)
    }, [purchasedTickets, purchasedParkingPass])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (fakeLoading) {
                event.preventDefault()
                event.stopPropagation()
            }
        }

        window.addEventListener('click', handleClickOutside)

        return () => {
            window.removeEventListener('click', handleClickOutside)
        }
    }, [fakeLoading])

    return (
        <AnimatePresence>
            <div className='relative flex-1 flex flex-col py-2 px-2 gap-6 max-lg:w-full'>
                <div className='w-full flex justify-between items-center gap-4'>
                    <div className='flex-1' />
                    <div className='flex-auto flex items-center justify-center gap-4'>
                        <button onClick={() => setDialogOpen(true)} className='text-white font-poppins font-semibold text-sm py-5 px-8 bg-[#232834] rounded-lg'>
                            Choose Your Tickets
                        </button>
                        {
                            availableParkingPasses?.quantity > 0 &&
                            <button onClick={() => setPurchasedParkingPass(prev => availableParkingPasses.quantity >= prev + 1 ? prev + 1 : prev)} className='text-white font-poppins font-semibold text-sm py-5 px-8 bg-[#232834] rounded-lg'>
                                Add Parking Pass
                            </button>
                        }
                    </div>
                    <div className='flex-1 flex items-center justify-end'>
                        <button disabled={eventData.seated} className='text-white font-poppins font-semibold text-sm py-5 px-8 bg-[#232834] rounded-lg'>
                            Map
                        </button>
                    </div>
                </div>
                {
                    Object.values(purchasedTickets).reduce((acc, ticket) => acc + ticket , 0) > 0 || purchasedParkingPass > 0 ? (
                        <div ref={parentRef} className='flex-1'>
                            <div className='h-full overflow-auto py-2' style={{ maxHeight: `${maxHeight}px` }}>
                                {Object.keys(purchasedTickets).slice().filter((ticket) => purchasedTickets[ticket] > 0).map((ticket) => (
                                    <motion.div layoutId={ticket} className='relative px-36 flex justify-between mb-12 items-center py-6 bg-white rounded-xl overflow-visible' key={ticket}>
                                        <p className='text-black font-poppins text-normal font-semibold flex-1'>{ticket}</p>
                                        {
                                            purchasedTickets[ticket] > 0 && (
                                                <div className='flex justify-center items-center flex-1 gap-2'>
                                                    {
                                                        purchasedTickets[ticket] > 1 &&
                                                        <button 
                                                            className='bg-black text-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setPurchasedTickets(prev => ({...prev, [ticket]: prev[ticket] - 1}))}
                                                            }
                                                        >
                                                            -
                                                        </button>
                                                    }
                                                    <p className='text-black font-poppins text-sm font-semibold'>{purchasedTickets[ticket]}</p>
                                                    <button
                                                        className='bg-black text-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setPurchasedTickets(prev => ({...prev, [ticket]: (availableTickets.find(ticketData => ticketData?.name === ticket)?.quantity ?? 0) >= prev[ticket] + 1 ? prev[ticket] + 1 : prev[ticket]}))}
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )
                                        }
                                        <p className='text-black font-poppins font-semibold flex-1 text-end'><FormattedPrice price={availableTickets.find(availableTicket => availableTicket.name === ticket)?.price ?? 0} exchangeRate={exchangeRate} /></p>
                                        <div onClick={() => setPurchasedTickets(prev => ({...prev, [ticket]: 0 }))} className='absolute cursor-pointer w-4 h-4 bg-black rounded-full top-[-10px] right-0 text-white text-center flex items-center justify-center text-xs'>
                                            X
                                        </div>
                                    </motion.div>
                                ))}
                                {
                                    purchasedParkingPass &&
                                    <motion.div layoutId={'parkinPass'} className='relative px-36 flex justify-between mb-12 items-center py-6 bg-white rounded-xl overflow-visible'>
                                        <p className='text-black font-poppins text-normal font-semibold flex-1'>Parking pass</p>
                                        {
                                            purchasedParkingPass > 0 && (
                                                <div className='flex justify-center items-center flex-1 gap-2'>
                                                    {
                                                        purchasedParkingPass > 1 &&
                                                        <button 
                                                            className='bg-black text-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setPurchasedParkingPass(prev => prev - 1)}
                                                            }
                                                        >
                                                            -
                                                        </button>
                                                    }
                                                    <p className='text-black font-poppins text-sm font-semibold'>{purchasedParkingPass}</p>
                                                    <button
                                                        className='bg-black text-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setPurchasedParkingPass(prev => availableParkingPasses.quantity >= prev + 1 ? prev + 1 : prev)
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )
                                        }
                                        <p className='text-black font-poppins font-semibold flex-1 text-end'><FormattedPrice price={availableParkingPasses?.price ?? 0} exchangeRate={exchangeRate} /></p>
                                        <div onClick={() => setPurchasedParkingPass(0)} className='absolute cursor-pointer w-4 h-4 bg-black rounded-full top-[-10px] right-0 text-white text-center flex items-center justify-center text-xs'>
                                            X
                                        </div>
                                    </motion.div>
                                }
                            </div>
                        </div>
                    ) : (
                        <div ref={parentRef} className='flex-1 w-full flex items-center justify-center'>
                            <div className='py-6 px-14 bg-[rgba(255,255,255,0.15)] text-white font-poppins font-semibold text-sm rounded-lg'>
                                {"Choose Your Tickets & They’ll Appear Here"}
                            </div>
                        </div>
                    )
                    
                }
                <div className='w-full flex justify-between items-center py-2 px-8 bg-[#181C25] rounded-lg'>
                    <div className='flex flex-col items-center justify-between gap-4 mb-1'>
                        <p className='font-poppins text-base text-white'>Number of tickets</p>
                        <p className='font-poppins text-lg text-white font-semibold'>{Object.values(purchasedTickets).reduce((acc, ticket) => acc + ticket , 0)}</p>
                    </div>
                    {
                        availableParkingPasses?.quantity > 0 &&
                        <div className='flex flex-col items-center justify-between gap-4 mb-1'>
                            <p className='font-poppins text-base text-white'>Parking Pass</p>
                            <p className='font-poppins text-lg text-white font-semibold'>{purchasedParkingPass}</p>
                        </div>
                    }
                    <div className='flex flex-col items-center justify-between gap-4 mb-1'>
                        <p className='font-poppins text-base text-white'>Total</p>
                        <p className='font-poppins text-lg text-white font-semibold'><FormattedPrice price={total} exchangeRate={exchangeRate} /></p>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        {
                            user === null ? (
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button disabled className='font-poppins text-lg w-fit font-normal px-5 rounded-lg py-1.5 text-white bg-[#D9D9D9]'>
                                                Buy Now
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>You must be signed in!</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <button className='font-poppins text-lg w-fit font-normal px-5 rounded-lg py-1.5 text-white bg-[#D9D9D9]'>
                                    Buy Now
                                </button>
                            )
                        }
                    </div>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className='flex flex-col w-full max-w-[627px] p-0 bg-[#181C25] border-none'>
                        <div className='flex flex-col w-full max-w-[627px]'>
                            <div className='py-6 text-white font-poppins font-semibold bg-[#232834] items-center text-center rounded-t-lg'>
                                Choose one or more type of tickets
                            </div>
                            <div className='flex flex-col w-full divide-y-[1px] border-[rgba(255,255,255,0.25)]'>
                                {Object.keys(selectedTickets).map((ticket, index) => (
                                    <div
                                        key={index}
                                        className={cn('relative px-6 flex justify-between items-center py-6', availableTickets.find(ticketData => ticketData?.name === ticket)?.quantity === 0 ? 'opacity-40' : 'cursor-pointer hover:bg-[#13161d]')} 
                                        onClick={(e) => {
                                            const ticketQuantity = availableTickets.find(ticketData => ticketData?.name === ticket)?.quantity ?? 0
                                            if(ticketQuantity > 0 ) setSelectedTickets(prev => ({...prev, [ticket]: ticketQuantity >= prev[ticket] + 1 ? prev[ticket] + 1 : prev[ticket]}))
                                            else e.stopPropagation()
                                        }}
                                    >
                                        <p className='text-white font-poppins text-normal font-normal flex-1'>
                                            {ticket}
                                            {
                                                availableTickets.find(ticketData => ticketData?.name === ticket)?.parkingPass === 'Included' &&
                                                <span className='mt-auto text-end text-xs text-gray-400'>
                                                    {" "}(Including Parking Pass)
                                                </span>
                                            }
                                        </p>
                                        {
                                            selectedTickets[ticket] > 0 && (
                                                <div className='flex justify-center items-center flex-1 gap-2'>
                                                    <button 
                                                        className='bg-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setSelectedTickets(prev => ({...prev, [ticket]: prev[ticket] - 1}))}
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <p className='text-white font-poppins text-sm font-semibold'>{selectedTickets[ticket]}</p>
                                                    <button 
                                                        className='bg-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setSelectedTickets(prev => ({...prev, [ticket]: (availableTickets.find(ticketData => ticketData?.name === ticket)?.quantity ?? 0) >= prev[ticket] + 1 ? prev[ticket] + 1 : prev[ticket]}))}
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )
                                        }
                                        {
                                            availableTickets.find(ticketData => ticketData?.name === ticket)?.quantity === 0 &&
                                            <div className='flex items-center justify-center bg-transparent border-none outline-none'>
                                                <p className='font-poppins font-normal text-white text-center text-base'>Sold out!</p>
                                            </div>
                                        }
                                        <p className='text-white font-poppins text-normal font-light flex-1 text-end'><FormattedPrice price={availableTickets.find(availableTicket => availableTicket.name === ticket)?.price ?? 0} exchangeRate={exchangeRate} /></p>
                                    </div>
                                ))}
                            </div>
                            <div 
                                className={cn('py-6 text-white font-poppins font-normal bg-[#5C5C5C] items-center text-center cursor-pointer', Object.values(selectedTickets).find(ticket => ticket > 0) && 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]')}
                                onClick={() => {
                                    setFakeLoading(true)
                                    setTimeout(() => {
                                        setPurchasedTickets(selectedTickets)
                                        setFakeLoading(false)
                                        setDialogOpen(false)
                                    }, 2000)
                                }}
                            >
                                Add Tickets
                            </div>
                        </div>
                        <Dialog open={fakeLoading}>
                            <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                                <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                            </DialogContent>
                        </Dialog>
                    </DialogContent>
                </Dialog>
            </div>
        </AnimatePresence>
    )
}