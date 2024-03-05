'use server'
import { initAdmin } from "@/firebase/server/config"
import { EventType } from "@/lib/types/eventTypes"
import { TicketType } from "@/lib/types/ticketTypes"
import { UserType } from "@/lib/types/userTypes"
import { Timestamp } from "firebase/firestore"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"
import ViewMyTickets from "@/components/auth/profile/ViewMyTickets"

type Props = {
    user: UserType
}

export default async function MyTickets({ user }: Props)
{
    const admin = await initAdmin()

    const ticketsPromise = user.tickets?.map(async (ticketId) => {
        const ticketData = await admin.firestore().collection('tickets')?.doc(ticketId).get()
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
        const eventData = await admin.firestore().collection('events')?.doc(eventId).get()
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

    const currentTickets = ticketsData.filter(ticket => eventsData.find(event => event.id === ticket.eventId)?.eventDate! >= Timestamp.now().toDate())
    const pastTickets = ticketsData.filter(ticket => eventsData.find(event => event.id === ticket.eventId)?.eventDate! <= Timestamp.now().toDate())

    return (
        <Suspense fallback={<Loader2 className='animate-spin' />}>
            <ViewMyTickets user={user} currentTickets={currentTickets} pastTickets={pastTickets} />
        </Suspense>
    )
}