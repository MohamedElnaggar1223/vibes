'use client'
import { UserType } from "@/lib/types/userTypes";
import { cn } from "@/lib/utils";
import { Suspense, useState } from "react";
import CurrentTickets from "./tickets/CurrentTickets";
import PastTickets from "./tickets/PastTickets";
import TicketsLoading from "./tickets/TicketsLoading";
import useSWR from 'swr'
import { TicketType } from "@/lib/types/ticketTypes";
import { db } from "@/firebase/client/config";
import { getDoc, doc, Timestamp } from "firebase/firestore";
import { EventType } from "@/lib/types/eventTypes";

type Props = {
    user: UserType,
}

export default function ViewMyTickets({ user }: Props)
{
    const [selectedTab, setSelectedTab] = useState('current')

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

        const eventsPromise = ticketsEvents.map(async (eventId) => {
            const eventData = await getDoc(doc(db, 'events', eventId))
            const eventFinalData = {
                ...eventData.data(),
                createdAt: eventData.data()?.createdAt?.toDate(),
                eventDate: eventData.data()?.eventDate?.toDate(),
                eventTime: eventData.data()?.eventTime?.toDate(),
                gatesOpen: eventData.data()?.gatesOpen?.toDate(),
                gatesClose: eventData.data()?.gatesClose?.toDate(),
                updatedAt: eventData.data()?.updatedAt?.toDate(),
            } as EventType
            return eventFinalData
        })

        const eventsData = await Promise.all(eventsPromise!)

        return {
            currentTickets: ticketsData.filter(ticket => eventsData.find(event => event.id === ticket.eventId)?.eventDate! >= Timestamp.now().toDate()),
            pastTickets: ticketsData.filter(ticket => eventsData.find(event => event.id === ticket.eventId)?.eventDate! <= Timestamp.now().toDate())
        }
    })

    return (
        <div className='flex flex-1 flex-col items-center justify-center min-h-[60%] max-h-[60%]'>
            <div className='flex items-start justify-between px-12 gap-12 h-fit'>
                <button onClick={() => setSelectedTab('current')} className={cn('px-2 py-2 font-poppins text-white bg-gradient-to-r rounded-md', selectedTab === 'current' ? 'font-semibold from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]' : 'font-light bg-transparent')}>Current Tickets</button>
                <button onClick={() => setSelectedTab('past')} className={cn('px-2 py-2 font-poppins text-white bg-gradient-to-r rounded-md', selectedTab === 'past' ? 'font-semibold from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]' : 'font-light bg-transparent')}>Past Tickets</button>
            </div>
            <div className='flex flex-col flex-1 w-full items-center justify-start mt-8 overflow-auto gap-12'>
                {
                    selectedTab === 'current' ? (
                        isLoading ? <TicketsLoading /> : <CurrentTickets user={user} />
                    ) : (
                        isLoading ? <TicketsLoading /> : <PastTickets user={user} />
                    )
                }
            </div>
            
        </div>
    )
}