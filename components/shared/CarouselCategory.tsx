import { Carousel, CarouselContent } from "../ui/carousel"
import { initAdmin } from "@/firebase/server/config"
import { EventType, ExchangeRate } from "@/lib/types/eventTypes"
import EventCard from "../cards/EventCard"

type Props = {
    title: string,
    subTitle: string,
    events: string[]
}

export default async function CarouselCategory({ title, subTitle, events }: Props) 
{
    const admin = await initAdmin()
    const eventsDocs = events?.map(async (event) => {
        const eventDoc = await admin.firestore().collection('events').doc(event).get()
        return {
            ...eventDoc.data(),
            createdAt: eventDoc.data()?.createdAt.toDate(),
            eventTime: eventDoc.data()?.eventTime.toDate(),
            eventDate: eventDoc.data()?.eventDate.toDate(),
            updatedAt: eventDoc.data()?.updatedAt?.toDate(),
        }
    })
    const eventsData = await Promise.all(eventsDocs || []) as EventType[]

    const exchangeRate = await (await admin.firestore().collection('rates').get()).docs.map(doc => ({...doc.data(), updatedAt: doc.data().updatedAt.toDate()}))[0] as ExchangeRate

    return (
        <section className='relative w-full flex flex-col items-center h-[412px] justify-center gap-4 lg:flex-row'>
            <div className='flex flex-col gap-2 w-[15%] text-white lg:mb-auto mt-2'>
                <p className='font-poppins font-black text-3xl'>{title}</p>
                <div className='w-3/12 h-[2px] bg-white mb-4' />
                <p className='font-poppins font-medium text-xs'>{subTitle}</p>
            </div>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="h-full max-lg:w-full lg:flex-1"
            >
                <CarouselContent className=''>
                    {eventsData.map((event) => (
                        <EventCard key={event.id} event={event} exchangeRate={exchangeRate} />
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    )
}
