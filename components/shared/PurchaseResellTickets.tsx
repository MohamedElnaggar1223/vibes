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
import { Bundle, BundleWithTickets, TicketType } from "@/lib/types/ticketTypes"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion"

type Props = {
    event: EventType,
    exchangeRate: ExchangeRate,
    user: UserType | null
    locale: string | undefined
    ticketsForSale: TicketType[]
    bundlesForSale: Bundle[]
    bundlesWithTickets: BundleWithTickets[]
}

function addValues(obj1: any, obj2: any) {
    const tempObj = {...obj1}
    Object.keys(obj2).forEach(key => {
        tempObj[key] = (tempObj[key]?? 0) + obj2[key]
    })
    return tempObj
}

export default function PurchaseResellTickets({ bundlesWithTickets, event, exchangeRate, user, locale, bundlesForSale, ticketsForSale }: Props) 
{
    const context = useContext(CountryContext)
    if(!context) return <Loader2 className='animate-spin' />
    const { country } = context

    const router = useRouter()

    const pathname = usePathname()

    const { t } = useTranslation()

    const [buyToolTip, setButToolTip] = useState(false)
    const [eventData, setEventData] = useState(event)
    const [loading, setLoading] = useState(false)
    const [maxHeight, setMaxHeight] = useState(0)
    const [currentWidth, setCurrentWidth] = useState<number>()
    const [selectedTickets, setSelectedTickets] = useState<{ id: string, price: number, type: string, country: string }[]>([])
    const [tab, setTab] = useState('all')
    const [disabledBtn, setDisabledBtn] = useState([''])

    const handleReserveTickets = (ticket: (TicketType | BundleWithTickets) & { type: string }) => {
        setDisabledBtn(prev => [...prev, ticket.id])
        if(selectedTickets.find(selectedTicket => selectedTicket.id === ticket.id)) {
            setSelectedTickets(prev => prev.filter(selectedTicket => selectedTicket.id !== ticket.id))
        }
        else {
            let price = 0
            let country = ''
            if(ticket.type === 'bundle') {
                price = (((ticket as BundleWithTickets).price) + ((((event?.resellMarkup ?? 0) / 100)) * ((ticket as BundleWithTickets).price)))
                country = (ticket as BundleWithTickets).tickets[0].country
            }
            else {
                const typedTicket = ticket as TicketType
                country = typedTicket.country
                price = typeof typedTicket.salePrice === 'string' ? (parseFloat(typedTicket.salePrice ?? '0') + ((((event?.resellMarkup ?? 0) / 100)) * parseFloat(typedTicket.salePrice ?? '0'))) : ((typedTicket.salePrice!) + ((((event?.resellMarkup ?? 0) / 100)) * (typedTicket.salePrice!)))
            }
            setSelectedTickets(prev => [...prev, { id: ticket.id, price, type: ticket.type, country }])
        }
        setDisabledBtn(prev => prev.filter(disabledBtn => disabledBtn !== ticket.id))
    }

    const displayedAccordions = useMemo(() => {
        return eventData.tickets.map(ticket => {
            const individualTickets = ticketsForSale.filter(ticketForSale => (Object.keys(ticketForSale.tickets)[0] === ticket.name) && (!ticketForSale.bundleID)).map(ticket => ({...ticket, type: 'individual'}))
            const bundleTickets = bundlesWithTickets.filter(bundleForSale => bundleForSale.tickets.find(bundleTicket => Object.keys(bundleTicket.tickets)[0] === ticket.name)).map(ticket => ({...ticket, type: 'bundle'}))
            const allTickets = [...individualTickets, ...bundleTickets].filter(ticket => (ticket.type === tab) || (tab === 'all'))
            const finalTickets = allTickets.length > 0 ? allTickets.sort((a, b) => a?.createdAt?.getTime() - b?.createdAt?.getTime()) : []
            return (
                <AccordionItem value={ticket.name} key={ticket.name}>
                    <AccordionTrigger className='!no-underline w-full flex'>
                        <div className="flex items-center justify-between min-w-full border-none bg-[#EAEAEA] px-12 py-6">
                            <p className="font-poppins text-base font-normal">
                                {ticket.name}
                            </p>
                            <p className="font-poppins text-sm font-normal">
                                ({finalTickets.length}) <span className='font-light'>on sale</span>
                            </p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className='max-w-full flex flex-col gap-2 max-h-[325px] overflow-auto'>
                        {finalTickets.map(ticket => (
                            <div key={ticket.id} className='flex items-center justify-between border-none bg-[#EAEAEA] px-6 py-4'>
                                <p className="font-poppins text-sm font-medium">
                                    {ticket.type === 'bundle' ? `Bundle (${(ticket as BundleWithTickets).tickets.length}) tickets` : 'Individual ticket'}
                                </p>
                                <p className="font-poppins text-sm font-medium">
                                    {ticket.type === 'bundle' ? (((ticket as BundleWithTickets).price) + ((((event?.resellMarkup ?? 0) / 100)) * ((ticket as BundleWithTickets).price))) + " " + (ticket as BundleWithTickets).tickets[0].country : ((parseFloat((ticket as TicketType).salePrice?.toString() ?? '0')) + ((((event?.resellMarkup ?? 0) / 100)) * (parseFloat((ticket as TicketType).salePrice?.toString() ?? '0')))) + " " + (ticket as TicketType).country}
                                </p>
                                <button disabled={disabledBtn.includes(ticket.id)} onMouseDown={() => handleReserveTickets(ticket)} className={cn('font-poppins disabled:opacity-60 text-xs font-light w-[115px] h-[40px] rounded-[8px] border', selectedTickets.find(selectedTicket => selectedTicket.id === ticket.id) ? 'border-[#FF000080] bg-[#FF000033] text-black' : 'border-black bg-black text-white')}>
                                    {selectedTickets.find(selectedTicket => selectedTicket.id === ticket.id) ? "Remove ticket(s)" : "Reserve ticket(s)"}
                                </button>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            )
        })
    }, [ticketsForSale, bundlesForSale, bundlesWithTickets, eventData, tab, selectedTickets])
    
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
        if(selectedTickets.length === 0) return 0
        return selectedTickets.reduce((total, ticket) => {
            const ticketPrice = ticket.price
            const ticketCountry = ticket.country
            return total + (ticketCountry === 'EGP' ? ticketPrice / exchangeRate.USDToEGP : ticketCountry === 'SAR' ? ticketPrice / exchangeRate.USDToSAR : ticketPrice / exchangeRate.USDToAED)
        }, 0)
    }, [country, selectedTickets])

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

    const handleBuy = async () => {
        setLoading(true)
        console.log(selectedTickets)
        if(event.uploadedTickets) {
            await runTransaction(db, async (transaction) => {
                await Promise.all(selectedTickets.map(async (ticket) => {
                    if(ticket.type === 'individual') {
                        await transaction.update(doc(db, 'tickets', ticket.id), { saleStatus: 'inEscrow', requested: true, requestStatus: 'pending' }) 
                    }
                    else if(ticket.type === 'bundle') {
                        const bundle = bundlesWithTickets.find(bundle => bundle.id === ticket.id) ?? { id: ticket.id, tickets: [] }
                        await Promise.all(bundle.tickets.map(async (ticket) => {
                            await transaction.update(doc(db, 'tickets', ticket.id), { saleStatus: 'inEscrow' })
                        }))
                        await transaction.update(doc(db, 'bundles', bundle.id), { saleStatus: 'inEscrow', requested: true, requestStatus: 'pending' })
                    }
                }))
            })
        }
        else {
            await runTransaction(db, async (transaction) => {
                await Promise.all(selectedTickets.map(async (ticket) => {
                    if(ticket.type === 'individual') {
                        await transaction.update(doc(db, 'tickets', ticket.id), { saleStatus: 'sold' }) 
                    }
                    else if(ticket.type === 'bundle') {
                        const bundle = bundlesWithTickets.find(bundle => bundle.id === ticket.id) ?? { id: ticket.id, tickets: [] }
                        await Promise.all(bundle.tickets.map(async (ticket) => {
                            await transaction.update(doc(db, 'tickets', ticket.id), { saleStatus: 'sold' })
                        }))
                        await transaction.update(doc(db, 'bundles', bundle.id), { saleStatus: 'sold' })
                    }
                }))
            })
        }
        router.refresh()
        setLoading(false)
    }

    return (
        <AnimatePresence>
            <div className='relative flex-1 flex flex-col py-2 px-2 gap-6 max-lg:w-full max-lg:min-h-[80vh] max-lg:mb-4'>
                <div className='w-full flex justify-center items-center gap-4 lg:gap-12'>
                    <button onMouseDown={() => setTab('all')} className={cn('rounded-[4px] font-light py-2 flex-1 max-w-[197px] w-screen px-2 bg-gradient-to-r font-poppins', tab === 'all' ? 'from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] text-white' : 'bg-white text-black')}>
                        All tickets
                    </button>
                    <button onMouseDown={() => setTab('individual')} className={cn('rounded-[4px] font-light py-2 flex-1 max-w-[197px] w-screen px-2 bg-gradient-to-r font-poppins', tab === 'individual' ? 'from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] text-white' : 'bg-white text-black')}>
                        Individual tickets
                    </button>
                    <button onMouseDown={() => setTab('bundle')} className={cn('rounded-[4px] font-light py-2 flex-1 max-w-[197px] w-screen px-2 bg-gradient-to-r font-poppins', tab === 'bundle' ? 'from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] text-white' : 'bg-white text-black')}>
                        Bundles
                    </button>
                </div>
                <Accordion type="multiple" className="w-full !border-none !divide-none">
                    {displayedAccordions}
                </Accordion>
                <div className='w-full h-[5.5rem] flex justify-between gap-4 items-center px-4 py-2 lg:px-32 bg-[#181C25] rounded-lg'>
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
                                                    setButToolTip(true)
                                                    setTimeout(() => setButToolTip(false), 2000)
                                                }}  
                                                layout={true} 
                                                disabled={(currentWidth ?? 0) > 1024} 
                                                className='max-lg:flex-1 font-poppins text-xs lg:text-lg w-fit font-normal px-2 lg:px-5 rounded-lg py-1.5 text-white bg-[#D9D9D9]'
                                            >
                                                {t('common:buy')}
                                            </motion.button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{t('common:mustSignIn')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger asChild className="max-lg:flex-1">
                                            {/* Change Styles */}
                                            <motion.button layout={true} onClick={handleBuy} className={cn('font-poppins text-xs lg:text-lg w-fit font-normal px-5 rounded-lg py-1.5 text-white', selectedTickets.length === 0 ? 'bg-[#D9D9D9]' : 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]')}>
                                                {t('common:buy')}
                                            </motion.button>
                                        </TooltipTrigger>
                                    </Tooltip>
                                </TooltipProvider>
                            )
                        }
                    </div>
                </div>
                <Dialog open={loading}>
                    <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                        <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                    </DialogContent>
                </Dialog>
            </div>
        </AnimatePresence>
    )
}