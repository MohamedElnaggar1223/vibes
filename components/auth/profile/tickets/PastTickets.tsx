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
            {   
                tickets.length ?
                tickets.map(ticket => <MyTicketCard key={ticket.id} ticket={ticket} event={events.find(event => event.id === ticket.eventId)!} />) :
                <p className='h-44 w-full font-poppins text-white font-medium text-center flex items-center justify-center'>No tickets available!</p>
            }
        </Suspense>
    )
}