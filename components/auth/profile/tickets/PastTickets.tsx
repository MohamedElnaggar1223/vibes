import { TicketType } from "@/lib/types/ticketTypes"
import { Suspense } from "react"
import Loading from "./TicketsLoading"
import MyTicketCard from "@/components/cards/MyTicketCard"
import { EventType } from "@/lib/types/eventTypes"

type Props = {
    tickets: TicketType[],
    events: EventType[]
}

export default function PastTickets({ tickets, events }: Props)
{

    return (
        <Suspense fallback={<Loading />}>
            {tickets.map(ticket => <MyTicketCard key={ticket.id} ticket={ticket} event={events.find(event => event.id === ticket.eventId)!} />)}
        </Suspense>
    )
}