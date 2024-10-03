'use client'

import { startTransition, useContext, useEffect, useMemo, useRef, useState } from "react"
import {
    Dialog,
    DialogContent,
  } from "@/components/ui/dialog"
import { cn, toArabicNums } from "@/lib/utils"
import { Check, Loader2 } from "lucide-react"
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
import { Timestamp, addDoc, arrayUnion, collection, doc, onSnapshot, runTransaction, updateDoc } from "firebase/firestore"
import { db } from "@/firebase/client/config"
import { CountryContext } from "@/providers/CountryProvider"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import useEventTicketsStore from "@/stores/eventTicketsStore"

type Props = {
    event: EventType,
    exchangeRate: ExchangeRate,
    user: UserType | null
    locale: string | undefined
}

function addValues(obj1: any, obj2: any) {
    const tempObj = {...obj1}
    Object.keys(obj2).forEach(key => {
        tempObj[key] = (tempObj[key]?? 0) + obj2[key]
    })
    return tempObj
}

export default function PurchaseTickets({ event, exchangeRate, user, locale }: Props) 
{
    const context = useContext(CountryContext)
    if(!context) return <Loader2 className='animate-spin' />
    const { country } = context

    const router = useRouter()

    const pathname = usePathname()

    const { t } = useTranslation()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [buyToolTip, setButToolTip] = useState(false)
    const [eventData, setEventData] = useState(event)
    const availableTickets = useMemo(() => {
        return eventData.tickets
    }, [eventData])
    const availableParkingPasses = useMemo(() => {
        return eventData.parkingPass
    }, [eventData])
    const availableSeats = useMemo(() => {
        return eventData.seatPattern
    }, [eventData])
    // const [selectedTickets, setSelectedTickets] = useState(availableTickets.reduce((acc, ticket) => ({...acc, [ticket.name]: 0 }), {} as { [x: string]: number }))
    // const [selectedSeats, setSelectedSeats] = useState({} as { [x: string]: string })
    // const [confirmedSeats, setConfirmedSeats] = useState({} as { [x: string]: string })
    // const [purchasedTickets, setPurchasedTickets] = useState({} as { [x: string]: number })
    // const [purchasedParkingPass, setPurchasedParkingPass] = useState(0)
    const { eventTickets, updateEvent, addEvent } = useEventTicketsStore()
    const [loading, setLoading] = useState(false)
    const [maxHeight, setMaxHeight] = useState(0)
    const [showMap, setShowMap] = useState(false)
    const [showSeats, setShowSeats] = useState(false)
    const [currentWidth, setCurrentWidth] = useState<number>()

    const foundEvent = useMemo(() => eventTickets.find(eventTicket => eventTicket.eventId === event.id), [eventTickets, event.id])

    useEffect(() => {
        if(!foundEvent) addEvent({ eventId: event.id, selectedTickets: availableTickets.reduce((acc, ticket) => ({...acc, [ticket.name]: 0 }), {} as { [x: string]: number }), selectedSeats: {}, confirmedSeats: {}, purchasedTickets: {}, purchasedParkingPass: 0 })
    }, [])

    useEffect(() => {
        if(window) setCurrentWidth(window?.innerWidth!)
    }, [])

    useEffect(() => {
        const handleResize = () => setCurrentWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const parentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMaxHeight(((parentRef.current?.offsetHeight === 0) || !parentRef.current?.offsetHeight) ? 500 : parentRef.current?.offsetHeight!)
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
        if(!foundEvent) return

        availableTickets.forEach(ticket => {
            if (foundEvent.selectedTickets[ticket.name] > ticket.quantity) {
                updateEvent({ ...foundEvent, selectedTickets: {...foundEvent.selectedTickets, [ticket.name]: ticket.quantity } })
            }
            if (foundEvent.purchasedTickets[ticket.name] > ticket.quantity) {
                updateEvent({ ...foundEvent, purchasedTickets: {...foundEvent.purchasedTickets, [ticket.name]: ticket.quantity } })
            }
        })
    }, [availableTickets])

    useEffect(() => {
        if(!foundEvent) return

        if(availableParkingPasses.quantity < foundEvent.purchasedParkingPass) updateEvent({ ...foundEvent, purchasedParkingPass: availableParkingPasses.quantity })
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
        if(!foundEvent) return 0

        return Object.keys(foundEvent.purchasedTickets).reduce((acc, ticket) => acc + foundEvent.purchasedTickets[ticket] * parseInt(availableTickets.find(availableTicket => availableTicket.name === ticket)?.price.toString() || '0'), 0) + foundEvent.purchasedParkingPass * (availableParkingPasses.price ?? 0)
    }, [foundEvent, country])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (loading) {
                event.preventDefault()
                event.stopPropagation()
            }
        }

        window.addEventListener('click', handleClickOutside)

        return () => {
            window.removeEventListener('click', handleClickOutside)
        }
    }, [loading])

    const selectedExchangeRate = useMemo(() => {
        if(country === 'EGP') return exchangeRate.USDToEGP
        else if(country === 'SAR') return exchangeRate.USDToSAR
        else return exchangeRate.USDToAED
    }, [country])

    const RemainingSeats = useMemo(() => {
        if(!foundEvent) return {}

        const remainingKeys = Object.keys(availableSeats).filter(seatPattern => !Object.keys(foundEvent.confirmedSeats).includes(seatPattern))
        return remainingKeys.reduce((acc, key) => {
            acc[key] = availableSeats[key];
            return acc;
          }, {} as { [x: string]: string });
    }, [foundEvent, availableSeats])

    const handleAddSeats = (seat: {[x: string]: string}) => {

        if(!foundEvent) return

        console.log(seat)

        const seatKey = Object.keys(seat)[0]
        const seatTicket = Object.values(seat)[0]

        const seatData = seatKey.split("_")
        const seatType = seatData[0]


        if(Object.keys(foundEvent.selectedSeats).find(seatSelected => Object.keys(seat)[0] === seatSelected)) {
            const tempSeats = {...foundEvent.selectedSeats}
            delete tempSeats[seatKey]

            updateEvent({ ...foundEvent, selectedSeats: tempSeats })

            return
        }

        if(foundEvent.purchasedTickets[seatType] > 0 && Object.keys(foundEvent.selectedSeats).filter(seatPattern => seatPattern.includes(seatType)).length < foundEvent.purchasedTickets[seatType]) {
            updateEvent({ ...foundEvent, selectedSeats: {...foundEvent.selectedSeats, [seatKey]: seatTicket } })
        }
    }

    const handleBuyTickets = async () => {
        startTransition(() => {
            setLoading(true)
        })
        try 
        {
            if(!foundEvent) return

            const addedTicketObject = {
                userId: user?.id,
                eventId: event.id,
                seated: eventData.seated,
                country: country,
                createdAt: Timestamp.now(),
            }

            if(eventData.seated)
            {
                let ticketsArray: { tickets: {}, seats: {} }[] = [];
                const tempSeats = {...foundEvent.confirmedSeats}
    
                Object.entries(foundEvent.purchasedTickets).forEach(([type, count]) => {
                    for (let i = 0; i < count; i++) {
                        const seatKey = Object.keys(tempSeats).find(seat => {
                            const seatData = seat.split("_")
                            return seatData[0] === type
                        });
                    
                        if (seatKey) {
                            ticketsArray.push({
                            tickets: {
                                [type]: 1
                            },
                            seats: {
                                [seatKey]: tempSeats[seatKey]
                            }
                            });
                    
                            delete tempSeats[seatKey];
                        }
                    }
                });

                const finalTicketsArray = ticketsArray.map((ticket) => ({...addedTicketObject, ...ticket, totalPaid: (eventData.tickets.find(eventTicket => eventTicket.name === Object.keys(ticket.tickets)[0])?.price ?? 0) * selectedExchangeRate}))

                const ticketsCollection = collection(db, 'tickets')
                const eventDoc = doc(db, 'events', event.id)
                const userDoc = doc(db, 'users', user?.id ?? '')

                let newCart = { tickets: [] as string[], createdAt: Timestamp.now(), status: 'pending' }

                const finalTicketsDocs = finalTicketsArray.map(async (ticket) => {
                    await runTransaction(db, async (transaction) => {
                        const ticketDoc = doc(ticketsCollection)
                        const newTicketDoc = doc(db, 'tickets', ticketDoc.id)
                        newCart.tickets.push(ticketDoc.id)
                        await transaction.set(ticketDoc, ticket)
                        await transaction.update(newTicketDoc, { id: ticketDoc.id })
                        fetch(process.env.NODE_ENV === 'production' ? `https://vibes-woad.vercel.app/api/sendMail?ticketId=${ticketDoc.id}` : `http://localhost:3000/api/sendMail?ticketId=${ticketDoc.id}`, {
                            method: 'GET',
                        })
                    })
                })

                await Promise.all(finalTicketsDocs)

                await runTransaction(db, async (transaction) => {
                    await transaction.update(userDoc, { cart: newCart })
                })

                await runTransaction(db, async (transaction) => {
                    if(eventData.seated) {
                        await transaction.update(eventDoc, { tickets: availableTickets.map(ticket => ({...ticket, quantity: ticket.quantity - foundEvent.purchasedTickets[ticket.name] })), seatPattern: RemainingSeats, ticketsSold: addValues(eventData.ticketsSold, foundEvent.purchasedTickets), parkingSold: eventData.parkingSold + foundEvent.purchasedParkingPass, totalRevenue: eventData.totalRevenue + total, parkingPass: {...eventData.parkingPass, quantity: eventData.parkingPass.quantity - foundEvent.purchasedParkingPass}, updatedAt: Timestamp.now() })
                    }
                    else {
                        await transaction.update(eventDoc, { tickets: availableTickets.map(ticket => ({...ticket, quantity: ticket.quantity - foundEvent.purchasedTickets[ticket.name] })), ticketsSold: addValues(eventData.ticketsSold, foundEvent.purchasedTickets), parkingSold: eventData.parkingSold + foundEvent.purchasedParkingPass, totalRevenue: eventData.totalRevenue + total, parkingPass: {...eventData.parkingPass, quantity: eventData.parkingPass.quantity - foundEvent.purchasedParkingPass}, updatedAt: Timestamp.now() })
                    }
                })

                // await runTransaction(db, async (transaction) => {
                //     const finalTicketsDocs = finalTicketsArray.map(async (ticket) => {
                //         const ticketDoc = doc(ticketsCollection)
                //         const newTicketDoc = doc(db, 'tickets', ticketDoc.id)    
                //         await transaction.set(ticketDoc, ticket)
                //         await transaction.update(userDoc, { cart: { tickets: (user?.cart?.tickets?.length ?? 0) === 0 ? [ticketDoc.id] : [...(user?.cart?.tickets ?? []), ticketDoc.id], createdAt: (user?.cart?.tickets?.length ?? 0) === 0 ? Timestamp.now() : user?.cart?.createdAt, status: 'pending' } })
                //         await transaction.update(newTicketDoc, { id: ticketDoc.id })
                //         fetch(process.env.NODE_ENV === 'production' ? `https://vibes-woad.vercel.app/api/sendMail?ticketId=${ticketDoc.id}` : `http://localhost:3000/api/sendMail?ticketId=${ticketDoc.id}`, {
                //             method: 'GET',
                //         })
                //     })

                //     await Promise.all(finalTicketsDocs)

                //     if(eventData.seated) {
                //         await transaction.update(eventDoc, { tickets: availableTickets.map(ticket => ({...ticket, quantity: ticket.quantity - purchasedTickets[ticket.name] })), seatPattern: RemainingSeats, ticketsSold: addValues(eventData.ticketsSold, purchasedTickets), parkingSold: eventData.parkingSold + purchasedParkingPass, totalRevenue: eventData.totalRevenue + total, parkingPass: {...eventData.parkingPass, quantity: eventData.parkingPass.quantity - purchasedParkingPass}, updatedAt: Timestamp.now() })
                //     }
                //     else {
                //         await transaction.update(eventDoc, { tickets: availableTickets.map(ticket => ({...ticket, quantity: ticket.quantity - purchasedTickets[ticket.name] })), ticketsSold: addValues(eventData.ticketsSold, purchasedTickets), parkingSold: eventData.parkingSold + purchasedParkingPass, totalRevenue: eventData.totalRevenue + total, parkingPass: {...eventData.parkingPass, quantity: eventData.parkingPass.quantity - purchasedParkingPass}, updatedAt: Timestamp.now() })
                //     }
                // })
            }
            else 
            {
                let ticketsArray: { tickets: {}, seats: {} }[] = [];
    
                Object.entries(foundEvent.purchasedTickets).forEach(([type, count]) => {
                    for (let i = 0; i < count; i++) {
                            ticketsArray.push({
                            tickets: {
                                [type]: 1
                            },
                            seats: {
                            }
                            });
                    
                        }
                });

                const finalTicketsArray = ticketsArray.map((ticket) => ({...addedTicketObject, ...ticket, totalPaid: (eventData.tickets.find(eventTicket => eventTicket.name === Object.keys(ticket.tickets)[0])?.price ?? 0) * selectedExchangeRate}))

                const ticketsCollection = collection(db, 'tickets')
                const eventDoc = doc(db, 'events', event.id)
                const userDoc = doc(db, 'users', user?.id ?? '')

                let newCart = { tickets: [] as string[], createdAt: Timestamp.now(), status: 'pending' }

                const finalTicketsDocs = finalTicketsArray.map(async (ticket) => {
                    await runTransaction(db, async (transaction) => {
                        const ticketDoc = doc(ticketsCollection)
                        const newTicketDoc = doc(db, 'tickets', ticketDoc.id)
                        newCart.tickets.push(ticketDoc.id)
                        await transaction.set(ticketDoc, ticket)
                        await transaction.update(newTicketDoc, { id: ticketDoc.id })
                        // fetch(process.env.NODE_ENV === 'production' ? `https://vibes-woad.vercel.app/api/sendMail?ticketId=${ticketDoc.id}` : `http://localhost:3000/api/sendMail?ticketId=${ticketDoc.id}`, {
                        //     method: 'GET',
                        // })
                    })
                })

                await Promise.all(finalTicketsDocs)

                await runTransaction(db, async (transaction) => {
                    await transaction.update(userDoc, { cart: newCart })
                })

                await runTransaction(db, async (transaction) => {
                    if(eventData.seated) {
                        await transaction.update(eventDoc, { tickets: availableTickets.map(ticket => ({...ticket, quantity: ticket.quantity - foundEvent.purchasedTickets[ticket.name] })), seatPattern: RemainingSeats, ticketsSold: addValues(eventData.ticketsSold, foundEvent.purchasedTickets), parkingSold: eventData.parkingSold + foundEvent.purchasedParkingPass, totalRevenue: eventData.totalRevenue + total, parkingPass: {...eventData.parkingPass, quantity: eventData.parkingPass.quantity - foundEvent.purchasedParkingPass}, updatedAt: Timestamp.now() })
                    }
                    else {
                        await transaction.update(eventDoc, { tickets: availableTickets.map(ticket => ({...ticket, quantity: ticket.quantity - foundEvent.purchasedTickets[ticket.name] })), ticketsSold: addValues(eventData.ticketsSold, foundEvent.purchasedTickets), parkingSold: eventData.parkingSold + foundEvent.purchasedParkingPass, totalRevenue: eventData.totalRevenue + total, parkingPass: {...eventData.parkingPass, quantity: eventData.parkingPass.quantity - foundEvent.purchasedParkingPass}, updatedAt: Timestamp.now() })
                    }
                })
            }
            
            // const addedTicketObject = {
            //     userId: user?.id,
            //     eventId: event.id,
            //     tickets: purchasedTickets,
            //     seats: confirmedSeats,
            //     seated: eventData.seated,
            //     parkingPass: purchasedParkingPass,
            //     country: country,
            //     totalPaid: total * selectedExchangeRate,
            //     createdAt: Timestamp.now(),
            // }

            // const ticketsCollection = collection(db, 'tickets')
            // const ticketDoc = doc(ticketsCollection)

            // const eventDoc = doc(db, 'events', event.id)

            // const userDoc = doc(db, 'users', user?.id ?? '')

            // const newTicketDoc = doc(db, 'tickets', ticketDoc.id)

            // await runTransaction(db, async (transaction) => {
            //     await transaction.set(ticketDoc, addedTicketObject)
            //     fetch(process.env.NODE_ENV === 'production' ? `https://vibes-woad.vercel.app/api/sendMail?ticketId=${ticketDoc.id}` : `http://localhost:3000/api/sendMail?ticketId=${ticketDoc.id}`, {
            //         method: 'GET',
            //     })
            //     if(eventData.seated) {
            //         await transaction.update(eventDoc, { tickets: availableTickets.map(ticket => ({...ticket, quantity: ticket.quantity - purchasedTickets[ticket.name] })), seatPattern: RemainingSeats, ticketsSold: addValues(eventData.ticketsSold, purchasedTickets), parkingSold: eventData.parkingSold + purchasedParkingPass, totalRevenue: eventData.totalRevenue + total, parkingPass: {...eventData.parkingPass, quantity: eventData.parkingPass.quantity - purchasedParkingPass}, updatedAt: Timestamp.now() })
            //     }
            //     else {
            //         await transaction.update(eventDoc, { tickets: availableTickets.map(ticket => ({...ticket, quantity: ticket.quantity - purchasedTickets[ticket.name] })), ticketsSold: addValues(eventData.ticketsSold, purchasedTickets), parkingSold: eventData.parkingSold + purchasedParkingPass, totalRevenue: eventData.totalRevenue + total, parkingPass: {...eventData.parkingPass, quantity: eventData.parkingPass.quantity - purchasedParkingPass}, updatedAt: Timestamp.now() })
            //     }
            //     await transaction.update(userDoc, { cart: { tickets: (user?.cart?.tickets?.length ?? 0) === 0 ? [ticketDoc.id] : [...(user?.cart?.tickets ?? []), ticketDoc.id], createdAt: (user?.cart?.tickets?.length ?? 0) === 0 ? Timestamp.now() : user?.cart?.createdAt, status: 'pending' } })
            //     await transaction.update(newTicketDoc, { id: ticketDoc.id })
            // })

            // // const salesDoc = await getDoc(doc(db,'sales', process.env.NEXT_PUBLIC_SALES_ID!))
            // // await updateDoc(doc(db,'sales', process.env.NEXT_PUBLIC_SALES_ID!), { totalRevenue: salesDoc.data()?.totalRevenue + total, totalTicketsSold: salesDoc.data()?.totalTicketsSold + Object.values(purchasedTickets).reduce((acc, ticket) => acc + ticket , 0), totalSales: salesDoc.data()?.totalSales + + purchasedParkingPass + Object.values(purchasedTickets).reduce((acc, ticket) => acc + ticket , 0), updatedAt: Timestamp.now() })
            setLoading(false)
            updateEvent({ ...foundEvent, selectedTickets: availableTickets.reduce((acc, ticket) => ({...acc, [ticket.name]: 0 }), {} as { [x: string]: number }), purchasedTickets: availableTickets.reduce((acc, ticket) => ({...acc, [ticket.name]: 0 }), {} as { [x: string]: number }), purchasedParkingPass: 0 })

            // await fetch(process.env.NODE_ENV === 'production' ? `https://vibes-woad.vercel.app/api/refreshCart` : `http://localhost:3000/api/refreshCart`, {  method: 'GET' })
            router.refresh()
            router.push('/cart')
            // router.push(`/success/${addedTicket.id}`)

            if(!event.uploadedTickets)
            {
                // const ticketsPdfs = Object.keys(addedTicketObject.tickets).forEach(async (ticket: any) => {
                //     const noOfTickets = addedTicketObject.tickets[ticket]
                //     for(let i = 0; i < noOfTickets; i++)
                //     {
                //         await fetch(process.env.NODE_ENV === 'production' ? 'https://vibes-woad.vercel.app/api/sendMail' : 'http://localhost:3000/api/sendMail', {
                //             method: 'POST',
                //             body: JSON.stringify({
                //                 "email": user?.email,
                //                 "event": event.name,
                //                 "ticket": addedTicket.id,
                //                 "addedTicket": ticket
                //             })
                //         })
                //     }
                // })
                // await Promise.all(ticketsPdfs!)
            }
            else
            {
                // await fetch(process.env.NODE_ENV === 'production' ? 'https://vibes-woad.vercel.app/api/sendPdfs' : 'http://localhost:3000/api/sendPdfs', {
                //     method: 'POST',
                //     body: JSON.stringify({
                //         "email": user?.email,
                //         "event": event,
                //         "purchasedTickets": purchasedTickets,
                //     })
                // })
            }
        }
        catch(e: any)
        {
            console.log(e)
            console.log(e.message)
            setLoading(false)
        }
    }

    if(!foundEvent) return <Loader2 className='animate-spin' />

    return (
        <AnimatePresence>
            <div className='relative flex-1 flex flex-col py-2 px-2 gap-6 max-lg:w-full max-lg:min-h-[80vh] max-lg:mb-4'>
                <div className='w-full flex justify-between items-center gap-1.5 lg:gap-4'>
                    <div className='flex-1 max-lg:hidden' />
                    <div className='lg:flex-auto flex max-lg:justify-start items-center justify-center gap-1.5 lg:gap-4'>
                        <button onClick={() => setDialogOpen(true)} className='text-white font-poppins font-semibold text-center text-xs lg:text-sm px-0.5 py-4 lg:py-5 lg:px-8 bg-[#232834] rounded-lg'>
                            {t('common:chooseticketshead')}
                        </button>
                        {
                            availableParkingPasses?.quantity > 0 &&
                            <button onClick={() => { if(foundEvent) updateEvent({ ...foundEvent, purchasedParkingPass: (availableParkingPasses.quantity >= (foundEvent?.purchasedParkingPass ?? 0) + 1 ? (foundEvent?.purchasedParkingPass ?? 0) + 1 : (foundEvent?.purchasedParkingPass)) ?? 0 })}} className='text-white font-poppins font-semibold text-xs lg:text-sm px-0.5 py-4 lg:py-5 lg:px-8 bg-[#232834] rounded-lg'>
                                {t('addParking')}
                            </button>
                        }
                    </div>
                    <div className='flex-1 flex items-center justify-end'>
                        <button disabled={!eventData.mapImage} onClick={() => setShowMap(true)} className='text-white w-fit font-poppins text-center font-semibold text-xs lg:text-sm px-0.5 py-4 lg:py-5 lg:px-8 bg-[#232834] rounded-lg'>
                            {t('common:map')}
                        </button>
                    </div>
                </div>
                {
                    Object.values(foundEvent.purchasedTickets).reduce((acc, ticket) => acc + ticket , 0) > 0 || foundEvent.purchasedParkingPass > 0 ? (
                        <div ref={parentRef} className='flex-1'>
                            <div className='h-full overflow-auto py-2' style={{ maxHeight: `${maxHeight}px` }}>
                                {Object.keys(foundEvent.purchasedTickets).slice().filter((ticket) => foundEvent.purchasedTickets[ticket] > 0).map((ticket) => (
                                    <motion.div layoutId={ticket} className={cn('relative z-10 px-4 lg:px-36 flex justify-between lg:mb-12 items-center py-6 bg-white rounded-xl overflow-visible', event.seated ? 'max-lg:my-[5rem]' : 'max-lg:my-8')} key={ticket}>
                                        <p className='text-black font-poppins text-sm lg:text-base font-semibold flex-1'>{locale === 'ar' ? event.tickets.find(t => t.name === ticket)?.nameArabic : ticket}</p>
                                        {
                                            foundEvent.purchasedTickets[ticket] > 0 && (
                                                <div className='flex justify-center items-center flex-1 gap-2'>
                                                    {
                                                        foundEvent.purchasedTickets[ticket] > 1 &&
                                                        <button
                                                            className='bg-black text-white text-sm lg:text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                updateEvent({ ...foundEvent, purchasedTickets: {...foundEvent.purchasedTickets, [ticket]: (foundEvent.purchasedTickets[ticket] - 1) } })
                                                            }}
                                                        >
                                                            -
                                                        </button>
                                                    }
                                                    <p className='text-black font-poppins text-sm font-semibold'>{locale === 'ar' ? toArabicNums(foundEvent.purchasedTickets[ticket].toString()) : foundEvent.purchasedTickets[ticket]}</p>
                                                    <button
                                                        className='bg-black text-white text-sm lg:text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            // setPurchasedTickets(prev => ({...prev, [ticket]: (availableTickets.find(ticketData => ticketData?.name === ticket)?.quantity ?? 0) >= prev[ticket] + 1 ? prev[ticket] + 1 : prev[ticket]}))}
                                                            updateEvent({ ...foundEvent, purchasedTickets: {...foundEvent.purchasedTickets, [ticket]: (availableTickets.find(ticketData => ticketData?.name === ticket)?.quantity ?? 0) >= (foundEvent.purchasedTickets[ticket] ?? 0) + 1 ? (foundEvent.purchasedTickets[ticket] ?? 0) + 1 : (foundEvent.purchasedTickets[ticket] ?? 0) } })
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )
                                        }
                                        <p className='text-black font-poppins text-sm lg:text-base font-semibold flex-1 text-end'><FormattedPrice price={(availableTickets.find(availableTicket => availableTicket.name === ticket)?.price ?? 0) * foundEvent.purchasedTickets[ticket]} exchangeRate={exchangeRate} /></p>
                                        {(currentWidth ?? 0) > 1024 ? (
                                            <div onClick={() => updateEvent({ ...foundEvent, purchasedTickets: {...foundEvent.purchasedTickets, [ticket]: 0 } })} className='absolute cursor-pointer w-4 h-4 bg-black rounded-full top-[-10px] right-0 text-white text-center flex items-center justify-center text-xs'>
                                                X
                                            </div>
                                        ) : (

                                            <div onClick={() => updateEvent({ ...foundEvent, purchasedTickets: {...foundEvent.purchasedTickets, [ticket]: 0 } })} className='absolute cursor-pointer w-20 h-8 bg-[rgba(222,0,0,0.5)] font-poppins rounded-lg top-[-28px] z-[5] right-0 text-white text-center flex items-center justify-center text-xs'>
                                                Delete
                                            </div>
                                        )}
                                        {eventData.seated && (
                                            <div onClick={() => setShowSeats(true)} className='absolute cursor-pointer px-2.5 py-2.5 bg-[rgba(0,142,23,0.5)] font-poppins rounded-lg bottom-[-32px] z-[5] right-0 text-white text-center flex items-center justify-center text-sm'>
                                                Choose Seats {foundEvent.purchasedTickets[ticket] >= 1 && Object.keys(foundEvent.confirmedSeats).filter(seatPattern => seatPattern.includes(ticket)).length < foundEvent.purchasedTickets[ticket] && `(${foundEvent.purchasedTickets[ticket] - Object.keys(foundEvent.confirmedSeats).filter(seatPattern => seatPattern.includes(ticket)).length} left)`}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                {
                                    foundEvent.purchasedParkingPass > 0 &&
                                    <motion.div layoutId={'parkinPass'} className='relative z-10 px-4 lg:px-36 flex justify-between max-lg:my-8 lg:mb-12 items-center py-6 bg-white rounded-xl overflow-visible'>
                                        <p className='text-black font-poppins text-sm lg:text-base font-semibold flex-1'>{t('parkingPass')}</p>
                                        {
                                            foundEvent.purchasedParkingPass > 0 && (
                                                <div className='flex justify-center items-center flex-1 gap-2'>
                                                    {
                                                        foundEvent.purchasedParkingPass > 1 &&
                                                        <button 
                                                            className='bg-black text-white text-sm lg:text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                updateEvent({ ...foundEvent, purchasedParkingPass: foundEvent.purchasedParkingPass - 1 })
                                                            }}
                                                        >
                                                            -
                                                        </button>
                                                    }
                                                    <p className='text-black font-poppins text-sm font-semibold'>{locale === 'ar' ? toArabicNums(foundEvent.purchasedParkingPass.toString()) : foundEvent.purchasedParkingPass}</p>
                                                    <button
                                                        className='bg-black text-white text-sm lg:text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            updateEvent({ ...foundEvent, purchasedParkingPass: (availableParkingPasses.quantity >= (foundEvent?.purchasedParkingPass ?? 0) + 1 ? (foundEvent?.purchasedParkingPass ?? 0) + 1 : (foundEvent?.purchasedParkingPass)) ?? 0 })
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )
                                        }
                                        <p className='text-black font-poppins font-semibold text-sm lg:text-base flex-1 text-end'><FormattedPrice price={(availableParkingPasses?.price ?? 0) * foundEvent.purchasedParkingPass} exchangeRate={exchangeRate} /></p>
                                        {(currentWidth ?? 0) > 1024 ? (
                                            <div onClick={() => updateEvent({...foundEvent, purchasedParkingPass: 0})} className='absolute cursor-pointer w-4 h-4 bg-black rounded-full top-[-10px] right-0 text-white text-center flex items-center justify-center text-xs'>
                                                X
                                            </div>
                                        ) : (

                                            <div onClick={() => updateEvent({...foundEvent, purchasedParkingPass: 0})}  className='absolute cursor-pointer w-20 h-8 bg-[rgba(222,0,0,0.5)] font-poppins rounded-lg top-[-28px] z-[5] right-0 text-white text-center flex items-center justify-center text-xs'>
                                                Delete
                                            </div>
                                        )}
                                    </motion.div>
                                }
                            </div>
                        </div>
                    ) : (
                        <div ref={parentRef} className='flex-1 w-full flex items-center justify-center'>
                            <div className='py-6 px-2.5 lg:px-14 bg-[rgba(255,255,255,0.15)] text-white text-center font-poppins font-semibold text-sm rounded-lg'>
                                {t('common:chooseticketsbody')}
                            </div>
                        </div>
                    )
                    
                }
                <div className='w-full h-[5.5rem] flex justify-between gap-4 items-center px-4 py-2 lg:px-8 bg-[#181C25] rounded-lg'>
                    <div className='flex flex-col items-center min-h-full justify-between gap-4 lg:mb-1 max-lg:flex-1'>
                        <p className='font-poppins text-center text-xs lg:text-base text-white'>{t('common:numberOfTickets')}</p>
                        <p className='font-poppins text-sm lg:text-lg text-white font-semibold'>{Object.values(foundEvent.purchasedTickets).reduce((acc, ticket) => acc + ticket , 0)}</p>
                    </div>
                    {
                        availableParkingPasses?.quantity > 0 &&
                        <div className='flex flex-col items-center min-h-full justify-between gap-4 lg:mb-1 max-lg:flex-1'>
                            <p className='font-poppins text-center text-xs lg:text-base text-white'>{t('common:numberOfParking')}</p>
                            <p className='font-poppins text-sm lg:text-lg text-white font-semibold'>{foundEvent.purchasedParkingPass}</p>
                        </div>
                    }
                    <div className='flex flex-col items-center min-h-full justify-between gap-4 lg:mb-1 max-lg:flex-1'>
                        <p className='font-poppins text-center text-xs lg:text-base text-white'>{t('common:total')}</p>
                        <p className='font-poppins text-sm mt-auto lg:text-lg text-white font-semibold'><FormattedPrice price={total} exchangeRate={exchangeRate} /></p>
                    </div>
                    <div className='max-lg:flex-1 flex flex-col items-center justify-center'>
                        {
                            !user?.id ? (
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip open={buyToolTip} onOpenChange={setButToolTip}>
                                        <TooltipTrigger asChild className="max-lg:flex-1">
                                            <motion.button 
                                                onClick={() => {
                                                    // setButToolTip(true)
                                                    // setTimeout(() => setButToolTip(false), 2000)
                                                    router.push(`/sign-in?redirectUrl=/events/${event.id}`)
                                                }}  
                                                layout={true} 
                                                className='max-lg:flex-1 cursor-pointer font-poppins text-xs lg:text-lg w-fit font-normal px-2 lg:px-5 rounded-lg py-1.5 text-white bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]'
                                            >
                                                {t('common:addCart')}
                                            </motion.button>
                                        </TooltipTrigger>
                                        {/* <TooltipContent>
                                            <p>{t('common:mustSignIn')}</p>
                                        </TooltipContent> */}
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger asChild className="max-lg:flex-1">
                                            <motion.button layout={true} onClick={handleBuyTickets} disabled={!(Object.values(foundEvent.purchasedTickets).reduce((acc, ticket) => acc + ticket , 0) > 0 || foundEvent.purchasedParkingPass > 0) || (eventData.seated && Object.keys(foundEvent.confirmedSeats).length < Object.values(foundEvent.purchasedTickets).reduce((acc, ticket) => acc + ticket , 0))} className={cn('font-poppins text-xs lg:text-lg w-fit font-normal px-5 rounded-lg py-1.5 text-white', !(Object.values(foundEvent.purchasedTickets).reduce((acc, ticket) => acc + ticket , 0) > 0 || foundEvent.purchasedParkingPass > 0) || (eventData.seated && Object.keys(foundEvent.confirmedSeats).length < Object.values(foundEvent.purchasedTickets).reduce((acc, ticket) => acc + ticket , 0)) ? 'bg-[#D9D9D9]' : 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]')}>
                                                {t('common:addCart')}
                                            </motion.button>
                                        </TooltipTrigger>
                                        {
                                            !(Object.values(foundEvent.purchasedTickets).reduce((acc, ticket) => acc + ticket , 0) > 0 || foundEvent.purchasedParkingPass > 0) &&
                                            <TooltipContent>
                                                <p>{t('common:mustAddTickets')}</p>
                                            </TooltipContent>
                                        }
                                        {
                                            (eventData.seated && Object.keys(foundEvent.confirmedSeats).length < Object.values(foundEvent.purchasedTickets).reduce((acc, ticket) => acc + ticket , 0)) &&
                                            <TooltipContent>
                                                <p>Choose Seats!</p>
                                            </TooltipContent>
                                        }
                                    </Tooltip>
                                </TooltipProvider>
                            )
                        }
                    </div>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent dir={pathname?.includes('/ar') ? 'rtl' : 'ltr'} className='flex flex-col w-full max-w-[350px] lg:max-w-[627px] p-0 bg-[#181C25] border-none'>
                        <div className='flex flex-col w-full max-w-[627px]'>
                            <div className='py-6 text-white font-poppins max-lg:text-base font-semibold bg-[#232834] items-center text-center rounded-t-lg'>
                                {t('common:choosetickets')}
                            </div>
                            <div className='flex flex-col w-full divide-y-[1px] border-[rgba(255,255,255,0.25)]'>
                                {Object.keys(foundEvent.selectedTickets).map((ticket, index) => (
                                    <div
                                        key={index}
                                        className={cn('relative px-6 flex justify-between items-center py-6', availableTickets.find(ticketData => ticketData?.name === ticket)?.quantity === 0 ? 'opacity-40' : 'cursor-pointer hover:bg-[#13161d]')} 
                                        onClick={(e) => {
                                            const ticketQuantity = availableTickets.find(ticketData => ticketData?.name === ticket)?.quantity ?? 0
                                            if(ticketQuantity > 0 ) updateEvent({...foundEvent, selectedTickets: {...foundEvent.selectedTickets, [ticket]: ticketQuantity >= foundEvent.selectedTickets[ticket] + 1 ? foundEvent.selectedTickets[ticket] + 1 : foundEvent.selectedTickets[ticket]}})
                                            else e.stopPropagation()
                                        }}
                                    >
                                        <p className='text-white font-poppins max-lg:text-sm lg:text-base font-normal flex-1'>
                                            {locale === 'ar' ? event.tickets.find(t => t.name === ticket)?.nameArabic : ticket}
                                            {
                                                availableTickets.find(ticketData => ticketData?.name === ticket)?.parkingPass === 'Included' &&
                                                <span className='mt-auto text-end text-xs text-gray-400'>
                                                    {" "}({t('includingParking')})
                                                </span>
                                            }
                                        </p>
                                        {
                                            foundEvent.selectedTickets[ticket] >= 0 && (!(availableTickets.find(ticketData => ticketData?.name === ticket)?.quantity === 0)) && (
                                                <div className='flex justify-center items-center flex-1 gap-2'>
                                                    <button 
                                                        className='bg-white disabled:opacity-65 max-lg:text-sm lg:text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            updateEvent({...foundEvent, selectedTickets: {...foundEvent.selectedTickets, [ticket]: foundEvent.selectedTickets[ticket] - 1}})
                                                        }}
                                                        disabled={foundEvent.selectedTickets[ticket] <= 0}
                                                    >
                                                        -
                                                    </button>
                                                    <p className='text-white font-poppins text-xs lg:text-sm font-semibold'>{locale === 'ar' ? toArabicNums(foundEvent.selectedTickets[ticket].toString()) : foundEvent.selectedTickets[ticket]}</p>
                                                    <button 
                                                        className='bg-white max-lg:text-sm lg:text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            updateEvent({...foundEvent, selectedTickets: {...foundEvent.selectedTickets, [ticket]: (availableTickets.find(ticketData => ticketData?.name === ticket)?.quantity ?? 0) >= foundEvent.selectedTickets[ticket] + 1 ? foundEvent.selectedTickets[ticket] + 1 : foundEvent.selectedTickets[ticket]}})
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )
                                        }
                                        {
                                            availableTickets.find(ticketData => ticketData?.name === ticket)?.quantity === 0 &&
                                            <div className='flex items-center justify-center bg-transparent border-none outline-none'>
                                                <p className='font-poppins font-normal text-white text-center max-lg:text-sm lg:text-base'>{t('common:soldout')}</p>
                                            </div>
                                        }
                                        <p className='text-white font-poppins max-lg:text-sm lg:text-base font-light flex-1 text-end'><FormattedPrice price={availableTickets.find(availableTicket => availableTicket.name === ticket)?.price ?? 0} exchangeRate={exchangeRate} /></p>
                                    </div>
                                ))}
                            </div>
                            <div 
                                className={cn('py-6 text-white font-poppins font-normal bg-[#5C5C5C] items-center text-center cursor-pointer', Object.values(foundEvent.selectedTickets).find(ticket => ticket > 0) && 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]')}
                                onClick={() => {
                                    updateEvent({...foundEvent, purchasedTickets: foundEvent.selectedTickets})
                                    setDialogOpen(false)
                                    if(event.seated) setShowSeats(true)
                                }}
                            >
                                {t('common:addTickets')}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog open={showSeats} onOpenChange={setShowSeats}>
                    <DialogContent dir={pathname?.includes('/ar') ? 'rtl' : 'ltr'} className='flex flex-col outline-none w-full max-w-[350px] lg:max-w-[627px] p-0 bg-[#181C25] border-none'>
                        <div className='flex flex-col w-full max-w-[627px]'>
                            <div className='py-6 text-white font-poppins outline-none max-lg:text-base font-semibold bg-[#232834] items-center text-center rounded-t-lg'>
                                {/* {t('common:choosetickets')} */}
                                Choose Seats
                            </div>
                            <div className='grid grid-cols-2 gap-2 py-2 px-2 outline-none w-full font-poppins'>
                                {Object.keys(availableSeats).filter(seatFilter => {
                                    const seatData = seatFilter.split("_")
                                    const seatType = seatData[0]
                                    return Object.keys(foundEvent.purchasedTickets).includes(seatType) && foundEvent.purchasedTickets[seatType] > 0
                                }).map((seat, index) => {
                                    const seatData = seat.split("_")
                                    const seatType = seatData[0]
                                    const seatRow = seatData[1].split("-")[1]
                                    const seatNumber = seatData[2].split("-")[1]

                                    const count = Object.keys(foundEvent.purchasedTickets).filter(ticket => foundEvent.purchasedTickets[ticket] > 0).length

                                    const numOfSelectedTickets = Object.values(foundEvent.purchasedTickets).reduce((acc, ticket) => acc + ticket , 0)
                                    const numOfSelectedSeats = Object.keys(foundEvent.selectedSeats).length

                                    const disabled = numOfSelectedTickets >= 1 && numOfSelectedTickets === numOfSelectedSeats
                                    
                                    return (
                                        <div
                                            key={index}
                                            onMouseDown={() => handleAddSeats({ [seat] : availableSeats[seat] })}
                                            className={cn('relative flex-1 py-8 flex outline-none flex-col justify-between items-center text-white', (disabled && !Object.keys(foundEvent.selectedSeats).includes(seat)) ? 'cursor-default' : 'cursor-pointer')}
                                        >
                                            {disabled && !Object.keys(foundEvent.selectedSeats).includes(seat) && <div className='absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-50 rounded-md' />}
                                            <p className='font-semibold text-lg'>Row: {seatRow} Seat: {seatNumber}</p>
                                            {count > 1 && <p className='font-medium text-sm'>({seatType})</p>}
                                            {Object.keys(foundEvent.selectedSeats).find(seatSelected => seat === seatSelected) && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }} className='absolute top-0 rounded-md z-50 w-full h-full border-2 border-[rgba(0,142,23,0.5)] flex items-start justify-end py-1 px-1'>
                                                    <Check className='w-6 h-6' stroke="#008E17" />
                                                </motion.div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            <div 
                                className={cn('py-6 text-white font-poppins font-normal bg-[#5C5C5C] items-center text-center cursor-pointer', Object.values(foundEvent.selectedTickets).find(ticket => ticket > 0) && 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]')}
                                onClick={() => {
                                    updateEvent({...foundEvent, confirmedSeats: foundEvent.selectedSeats})
                                    setShowSeats(false)
                                }}
                            >
                                {/* {t('common:addTickets')} */}
                                Select Seats
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog open={showMap} onOpenChange={setShowMap}>
                    <DialogContent className='flex items-center lg:min-w-[900px] lg:h-[600px] justify-center bg-transparent border-none outline-none'>
                        <Image
                            src={event.mapImage}
                            width={900}
                            height={600}
                            alt='event map'
                        />
                    </DialogContent>
                </Dialog>
                <Dialog open={loading}>
                    <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                        <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                    </DialogContent>
                </Dialog>
            </div>
        </AnimatePresence>
    )
}