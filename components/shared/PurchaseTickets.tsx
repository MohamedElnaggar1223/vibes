'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import {
    Dialog,
    DialogContent,
  } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export default function PurchaseTickets() 
{
    const [dialogOpen, setDialogOpen] = useState(false)
    const availableTickets = [{ ticket: 'Standard Ticket', price: '2,290' }, { ticket: 'Standard Plus', price: '3,500' }, { ticket: 'VIP Standing', price: '5,500' }, { ticket: 'VIP Premium', price: '8,000' }, ]
    const [selectedTickets, setSelectedTickets] = useState(availableTickets.reduce((acc, ticket) => ({...acc, [ticket.ticket]: 0 }), {} as { [x: string]: number }))
    const [purchasedTickets, setPurchasedTickets] = useState({} as { [x: string]: number })
    const [fakeLoading, setFakeLoading] = useState(false)
    const [maxHeight, setMaxHeight] = useState(0)

    const parentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMaxHeight(parentRef.current?.offsetHeight || 0)
    }, [])

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
        return Object.keys(purchasedTickets).reduce((acc, ticket) => acc + purchasedTickets[ticket] * parseInt(availableTickets.find(availableTicket => availableTicket.ticket === ticket)?.price.replace(/,/g, '') || '0'), 0)
    }, [purchasedTickets])

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
                    <div className='flex-1 flex items-center justify-center'>
                        <button onClick={() => setDialogOpen(true)} className='text-white font-poppins font-semibold text-sm py-5 px-8 bg-[#232834] rounded-lg'>
                            Choose Your Tickets
                        </button>
                    </div>
                    <div className='flex-1 flex items-center justify-end'>
                        <button className='text-white font-poppins font-semibold text-sm py-5 px-8 bg-[#232834] rounded-lg'>
                            Map
                        </button>
                    </div>
                </div>
                {
                    Object.values(purchasedTickets).reduce((acc, ticket) => acc + ticket , 0) > 0 ? (
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
                                                            setPurchasedTickets(prev => ({...prev, [ticket]: prev[ticket] + 1}))}
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )
                                        }
                                        <p className='text-black font-poppins font-semibold flex-1 text-end'>{availableTickets.find(availableTicket => availableTicket.ticket === ticket)?.price} EGP</p>
                                        <div onClick={() => setPurchasedTickets(prev => ({...prev, [ticket]: 0 }))} className='absolute cursor-pointer w-4 h-4 bg-black rounded-full top-[-10px] right-0 text-white text-center flex items-center justify-center text-xs'>
                                            X
                                        </div>
                                    </motion.div>
                                ))}
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
                    <div className='flex flex-col items-center justify-between gap-4 mb-1'>
                        <p className='font-poppins text-base text-white'>Total</p>
                        <p className='font-poppins text-lg text-white font-semibold'>{total.toLocaleString()} EGP</p>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <button className='font-poppins text-lg w-fit font-normal px-5 rounded-lg py-1.5 text-white bg-[#D9D9D9]'>
                            Buy Now
                        </button>
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
                                    <div key={index} className='px-6 flex justify-between items-center py-6 cursor-pointer hover:bg-[#13161d]' onClick={() => setSelectedTickets(prev => ({...prev, [ticket]: prev[ticket] + 1}))}>
                                        <p className='text-white font-poppins text-normal font-normal flex-1'>{ticket}</p>
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
                                                            setSelectedTickets(prev => ({...prev, [ticket]: prev[ticket] + 1}))}
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )
                                        }
                                        <p className='text-white font-poppins text-normal font-light flex-1 text-end'>{availableTickets.find(availableTicket => availableTicket.ticket === ticket)?.price} EGP</p>
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