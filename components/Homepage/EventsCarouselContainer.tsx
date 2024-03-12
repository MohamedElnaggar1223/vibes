import { Suspense } from "react";
import EventsCarousel from "./EventsCarousel";
import { EventType, ExchangeRate } from "@/lib/types/eventTypes";
import { initAdmin } from "@/firebase/server/config";

type Props = {
    events: string[] | undefined
}

export default async function EventsCarouselContainer({ events }: Props) 
{
    if(!events) return <></>

    console.log(events)

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

    const exchangeRate = await (await admin.firestore().collection('rates').get()).docs.map(doc => ({...doc.data(), updatedAt: doc.data().updatedAt.toDate()}))[0] as ExchangeRate

    return (
        <Suspense>
            <EventsCarousel events={eventData} exchangeRate={exchangeRate} />
        </Suspense>
    )
}
