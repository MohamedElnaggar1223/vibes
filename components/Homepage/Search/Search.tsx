import { initAdmin } from "@/firebase/server/config"
import { Category, EventType } from "@/lib/types/eventTypes"
import { cn, getEvents, initTranslations, toArabicNums } from "@/lib/utils"
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
    locale?: string | undefined
}

const countries = {
    'KSA': 'Saudi Arabia',
    'UAE': 'United Arab Emirates',
    'Egypt': 'Egypt'
}

export default async function Search({ search, date, category, country, categories, locale }: Props)
{
    const { t } = await initTranslations(locale!, ['homepage', 'common', 'auth'])

    const eventsData = await getEvents()
    const events = eventsData
                    .filter(event => search ? event.name.toLowerCase().includes(search.toLowerCase()) : true)
                    .filter(event => date ? event.eventDate.toISOString().includes(date) : true)
                    .filter(event => category ? event.categoryID === categories.find(cat => cat.category === (category === 'TheatreComedy' ? 'Theatre & comedy' : category))?.id : true)
                    .filter(event => country ? (event.country === countries[country]) : true)

    return (
        <section dir={locale === 'ar' ? 'rtl' : 'ltr'} className='flex flex-col items-center justify-center w-full overflow-x-hidden flex-1 h-max'>
            <p className={cn('text-left font-poppins font-thin text-white text-xs mt-3', locale === 'ar' ? 'ml-auto' : 'mr-auto')}>{t('showing')} ({locale === 'ar' ? toArabicNums(events.length.toString()) : events.length}) {t('results')}</p>
            <div className='w-full flex justify-start items-center gap-8 flex-wrap mb-auto mt-12 max-md:justify-center'>
                {events.map(event => (
                    <div key={event.id} className='max-lg:max-w-32 max-lg:min-h-32 lg:min-w-48 lg:min-h-48 rounded-lg overflow-hidden'>
                        <Link
                            href={`/events/${event.id}`}
                        >
                            <Image
                                src={event?.displayPageImage}
                                width={192} 
                                height={192} 
                                alt={event.name}
                                className='object-cover max-lg:max-w-32 max-lg:min-h-32 lg:min-w-48 lg:min-h-48 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out rounded-lg'
                                loading="lazy"
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}