'use client'
import { UserType } from "@/lib/types/userTypes";
import { cn } from "@/lib/utils";
import { Suspense, startTransition, useOptimistic, useState } from "react";
import CurrentTickets from "./tickets/CurrentTickets";
import PastTickets from "./tickets/PastTickets";
import TicketsLoading from "./tickets/TicketsLoading";
import useSWR from 'swr'
import { TicketType } from "@/lib/types/ticketTypes";
import { db } from "@/firebase/client/config";
import { getDoc, doc, Timestamp, collection, getDocs } from "firebase/firestore";
import { EventType } from "@/lib/types/eventTypes";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

type Props = {
    user: UserType,
}

export default function ViewMyTickets({ user }: Props)
{
    // const [selectedTab, setSelectedTab] = useState('current')
    const router = useRouter()
    const searchParams = useSearchParams()

    const pathname = usePathname()

    const { t } = useTranslation()

    const selectedTab = searchParams?.get('date') ?? 'upcoming'
    const [optimisticSelectedTab, setOptimisticSelectedTab] = useOptimistic(selectedTab, (_, nextTab: string) => nextTab)

    const { data, isLoading, error } = useSWR('tickets', async (...args) => {
        const ticketsPromise = user.tickets?.map(async (ticketId) => {
            const ticketData = await getDoc(doc(db, 'tickets', ticketId))
            const ticketFinalData = {
                ...ticketData.data(),
                createdAt: ticketData.data()?.createdAt?.toDate(),
            } as TicketType
            return ticketFinalData
        })

        const ticketsData = await Promise.all(ticketsPromise!)

        const ticketsEvents = [] as string[]
        ticketsData.forEach(ticket => !ticketsEvents.includes(ticket.eventId) && ticketsEvents.push(ticket.eventId))

        // const eventsPromise = ticketsEvents.map(async (eventId) => {
        //     const eventData = await getDoc(doc(db, 'events', eventId))
        //     const eventFinalData = {
        //         ...eventData.data(),
        //         createdAt: eventData.data()?.createdAt?.toDate() ?? undefined,
        //         eventDate: eventData.data()?.eventDate?.toDate() ?? undefined,
        //         eventTime: eventData.data()?.eventTime?.toDate() ?? undefined,
        //         gatesOpen: eventData.data()?.gatesOpen?.toDate() ?? undefined,
        //         gatesClose: eventData.data()?.gatesClose?.toDate() ?? undefined,
        //         updatedAt: eventData.data()?.updatedAt?.toDate() ?? undefined,
        //     } as EventType

        //     return eventFinalData
        // })

        // const eventsData = await Promise.all(eventsPromise!)

        const eventsData = (await getDocs(collection(db, 'events'))).docs.map(event => ({...event.data(), id: event.id, createdAt: event.data()?.createdAt?.toDate(), eventDate: event.data()?.eventDate?.toDate(), eventTime: event.data()?.eventTime?.toDate(), gatesOpen: event.data()?.gatesOpen?.toDate(), gatesClose: event.data()?.gatesClose?.toDate(), updatedAt: event.data()?.updatedAt?.toDate()})) as EventType[]

        return {
            upcomingTickets: ticketsData.filter(ticket => {
                const event = eventsData.find(event => event.id === ticket.eventId)
                return event?.eventDate! > Timestamp.now().toDate() && ticket.status === 'paid' && (!ticket.saleStatus || ticket.saleStatus === 'pending')
            }),
            cancelledTickets: ticketsData.filter(ticket => ticket.saleStatus === 'cancelled'),
            pastTickets: ticketsData.filter(ticket => {
                const event = eventsData.find(event => event.id === ticket.eventId)
                return event?.eventDate! <= Timestamp.now().toDate() && ticket.status === 'paid'
            }),
            events: eventsData,
        }
    })

    return (
        <div className='flex flex-1 flex-col items-center justify-center max-lg:w-full min-h-[80%] max-h-[80%]'>
            <div className='flex items-start justify-evenly lg:px-12 lg:gap-12 h-fit w-full'>
                <button 
                    onClick={() => {
                        setOptimisticSelectedTab('upcoming')
                        startTransition(() => router.push('?show=my-tickets&date=upcoming', { scroll: false }))
                    }} 
                    className={cn('px-2 py-2 font-poppins text-white bg-gradient-to-r rounded-md', optimisticSelectedTab === 'upcoming' ? 'font-semibold from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]' : 'font-light bg-transparent')}
                >
                    {t('auth:upcomingTickets')}
                </button>
                <button 
                    onClick={() => {
                        setOptimisticSelectedTab('cancelled')
                        startTransition(() => router.push('?show=my-tickets&date=cancelled', { scroll: false }))
                    }} 
                    className={cn('px-2 py-2 font-poppins text-white bg-gradient-to-r rounded-md', optimisticSelectedTab === 'cancelled' ? 'font-semibold from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]' : 'font-light bg-transparent')}
                >
                    {t('auth:cancelledTickets')}
                </button>
                <button 
                    onClick={() => {
                        setOptimisticSelectedTab('past')
                        startTransition(() => router.push('?show=my-tickets&date=past', { scroll: false }))
                    }} 
                    className={cn('px-2 py-2 font-poppins text-white bg-gradient-to-r rounded-md', optimisticSelectedTab === 'past' ? 'font-semibold from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]' : 'font-light bg-transparent')}
                >
                    {t('auth:pastTickets')}
                </button>
            </div>
            <div className='info flex flex-col flex-1 w-full items-center justify-start mt-8 overflow-auto gap-12 lg:gap-12'>
                {
                    optimisticSelectedTab === 'upcoming' ? (
                        isLoading ? <TicketsLoading /> : <CurrentTickets arabic={pathname?.includes('/ar') ?? false} tickets={data?.upcomingTickets!} events={data?.events!} />
                    ) : optimisticSelectedTab === 'cancelled' ? (
                        isLoading ? <TicketsLoading /> : <PastTickets tickets={data?.cancelledTickets!} events={data?.events!} />
                    ) : optimisticSelectedTab === 'past' ? (
                        isLoading ? <TicketsLoading /> : <PastTickets tickets={data?.pastTickets!} events={data?.events!} />
                    ) : (
                        isLoading ? <TicketsLoading /> : <CurrentTickets arabic={pathname?.includes('/ar') ?? false} tickets={data?.upcomingTickets!} events={data?.events!} />
                    )
                }
            </div>
            
        </div>
    )
}