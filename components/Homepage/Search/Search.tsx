import { initAdmin } from "@/firebase/server/config"
import { EventType } from "@/lib/types/eventTypes"
import Link from "next/link"
import { Suspense } from "react"
import SearchLoading from "./SearchLoading"
import SearchImageCard from "./SearchImageCard"

type Props = {
    search: string
}

export default async function Search({ search }: Props)
{
    const admin = await initAdmin()
    const eventsData = (await admin.firestore().collection('events').get()).docs.slice().filter(event => event.data().name.toLowerCase().includes(search.toLowerCase()))
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

    return (
        <Suspense fallback={<SearchLoading />}>
            <section className='flex flex-col items-center justify-center w-full overflow-x-hidden flex-1 h-max'>
                <div className='w-full flex justify-between items-center gap-8 flex-wrap mb-auto mt-12'>
                    {events.map(event => (
                        <div key={event.id} className='min-w-48 min-h-48 rounded-lg overflow-hidden'>
                            <Link
                                href={`/events/${event.id}`}
                            >
                                <SearchImageCard name={event.name} eventPageImage={event.eventPageImage} />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </Suspense>
    )
}