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
                    <div key={ticket.id} className='relative rounded-lg flex w-full max-2xl:min-h-fit max-2xl:max-h-64 2xl:min-h-44 2xl:max-h-44 p-0 2xl:overflow-hidden gap-8'>
                        <MyTicketCard ticket={ticket} event={events.find(event => event.id === ticket.eventId)!} first={index === 0}  />
                    </div>
                )) :
                <p className='h-44 w-full font-poppins text-white font-medium text-center flex items-center justify-center'>{t('auth:noTickets')}</p>
            }
        </Suspense>
    )
}