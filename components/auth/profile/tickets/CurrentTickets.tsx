import { TicketType } from "@/lib/types/ticketTypes"
import { Suspense } from "react"
import Loading from "./TicketsLoading"
import MyTicketCard from "@/components/cards/MyTicketCard"
import { EventType } from "@/lib/types/eventTypes"

type Props = {
    tickets: TicketType[],
    events: EventType[]
}

export default function CurrentTickets({ tickets, events }: Props)
{

    return (
        <div className='flex flex-col flex-1 w-full items-center justify-start mt-8 overflow-auto gap-12'>
            {tickets.map(ticket => <MyTicketCard key={ticket.id} ticket={ticket} event={events.find(event => event.id === ticket.eventId)!} />)}
        </div>
    )
}