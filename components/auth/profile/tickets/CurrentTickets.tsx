import { TicketType } from "@/lib/types/ticketTypes"
import { Suspense } from "react"
import Loading from "./TicketsLoading"
import MyTicketCard from "@/components/cards/MyTicketCard"
import { EventType } from "@/lib/types/eventTypes"
import { initTranslations } from "@/lib/utils"

type Props = {
    tickets: TicketType[],
    events: EventType[],
    arabic: boolean
}

export default async function CurrentTickets({ tickets, events, arabic }: Props)
{
    const locale = arabic ? 'ar' : 'en'
    const { t } = await initTranslations(locale, ['homepage', 'common', 'auth'])

    return (
        <Suspense fallback={<Loading />}>            
            {   
                tickets.length ?
                tickets.map((ticket, index) => (
                    <div key={ticket.id} className='relative rounded-lg flex w-full max-lg:min-h-fit max-lg:max-h-64 lg:min-h-48 lg:max-h-48 p-0 lg:overflow-hidden gap-8'>
                        <MyTicketCard ticket={ticket} event={events.find(event => event.id === ticket.eventId)!} first={index === 0}  />
                    </div>
                )) :
                <p className='h-48 w-full font-poppins text-white font-medium text-center flex items-center justify-center'>{t('auth:noTickets')}</p>
            }
        </Suspense>
    )
}