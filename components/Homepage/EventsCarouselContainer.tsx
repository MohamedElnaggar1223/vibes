import { Suspense } from "react";
import EventsCarousel from "./EventsCarousel";
import { Category, EventType, ExchangeRate } from "@/lib/types/eventTypes";
import { initAdmin } from "@/firebase/server/config";
import { getExchangeRate } from "@/lib/utils";

type Props = {
    events: string[] | undefined
    locale: string | undefined
    categories: Category[]
}

export default async function EventsCarouselContainer({ events, locale, categories }: Props) 
{
    if(!events) return <></>

    const admin = await initAdmin()
    const eventsDocs = events?.map(async (event) => {
        const eventDoc = await admin.firestore().collection('events').doc(event).get()
        return {
            ...eventDoc.data(),
            createdAt: eventDoc.data()?.createdAt.toDate(),
            eventTime: eventDoc.data()?.eventTime.toDate(),
            eventDate: eventDoc.data()?.eventDate.toDate(),
            updatedAt: eventDoc.data()?.updatedAt?.toDate(),
        } as EventType

    })
    const eventData = await Promise.all(eventsDocs || [])

    const exchangeRate = await getExchangeRate()
    
    return (
        <Suspense>
            <EventsCarousel categories={categories} locale={locale} events={eventData} exchangeRate={exchangeRate} />
        </Suspense>
    )
}
