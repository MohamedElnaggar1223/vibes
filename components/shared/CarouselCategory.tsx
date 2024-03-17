import { Carousel, CarouselContent } from "../ui/carousel"
import { initAdmin } from "@/firebase/server/config"
import { EventType, ExchangeRate } from "@/lib/types/eventTypes"
import EventCard from "../cards/EventCard"
import { getExchangeRate } from "@/lib/utils"

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
            gatesOpen: eventDoc.data()?.gatesOpen?.toDate(),
            gatesClose: eventDoc.data()?.gatesClose?.toDate(),
        } as EventType
    })
    const eventsDataPromise = await Promise.all(eventsDocs || [])

    const eventsData = eventsDataPromise.sort((a, b) => {
        if(a.createdAt && b.createdAt) return a.createdAt.getTime() - b.createdAt.getTime()
        else if(a.createdAt) return -1
        else if(b.createdAt) return 1
        else return 0
    })

    const exchangeRate = await getExchangeRate()

    return (
        <section className='relative w-full flex flex-col items-center h-[412px] justify-center gap-4 lg:flex-row'>
            <div className='flex flex-col gap-2 w-full lg:w-[15%] text-white lg:mb-auto mt-2'>
                <p className='font-poppins font-black text-3xl'>{title}</p>
                <div className='w-1/3 lg:w-3/12 h-[2px] bg-white mb-4' />
                <p className='w-full font-poppins font-medium text-xs'>{subTitle}</p>
            </div>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="h-full max-lg:max-w-[100vw] lg:flex-1 lg:ml-12"
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
