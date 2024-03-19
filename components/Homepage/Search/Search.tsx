import { initAdmin } from "@/firebase/server/config"
import { Category, EventType } from "@/lib/types/eventTypes"
import Image from "next/image"
import Link from "next/link"
import { cache } from "react"

type Props = {
    search: string | undefined,
    date: string | undefined,
    category: string | undefined,
    country: 
        'KSA' |
        'UAE' |
        'Egypt' 
     | undefined,
    categories: Category[]
}

const getEvents = cache(async () => {
    const admin = await initAdmin()
    const eventsData = (await admin.firestore().collection('events').get()).docs
    const eventsDocs = eventsData?.map(async (event) => {
        return {
            ...event.data(),
            createdAt: event.data()?.createdAt.toDate(),
            eventTime: event.data()?.eventTime.toDate(),
            eventDate: event.data()?.eventDate.toDate(),
            updatedAt: event.data()?.updatedAt?.toDate(),
        } as EventType

    })
    const events = await Promise.all(eventsDocs || [])

    return events
})

export default async function Search({ search, date, category, country, categories }: Props)
{
    const countries = {
        'KSA': 'Saudi Arabia',
        'UAE': 'United Arab Emirates',
        'Egypt': 'Egypt'
    }

    const eventsData = await getEvents()
    const events = eventsData
                    .filter(event => search ? event.name.toLowerCase().includes(search.toLowerCase()) : true)
                    .filter(event => date ? event.eventDate.toISOString().includes(date) : true)
                    .filter(event => category ? event.categoryID === categories.find(cat => cat.category === (category === 'TheatreComedy' ? 'Theatre & comedy' : category))?.id : true)
                    .filter(event => country ? (event.country === countries[country]) : true)

    return (
        <section className='flex flex-col items-center justify-center w-full overflow-x-hidden flex-1 h-max'>
            <p className='text-left font-poppins font-thin text-white text-xs mr-auto mt-3'>Showing ({events.length}) results</p>
            <div className='w-full flex justify-start items-center gap-8 flex-wrap mb-auto mt-12 max-md:justify-center'>
                {events.map(event => (
                    <div key={event.id} className='min-w-48 min-h-48 rounded-lg overflow-hidden'>
                        <Link
                            href={`/events/${event.id}`}
                        >
                            <Image
                                src={event?.displayPageImage}
                                width={192} 
                                height={192} 
                                alt={event.name}
                                className='object-cover min-w-48 min-h-48 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out rounded-lg'
                                loading="lazy"
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}