import { initAdmin } from "@/firebase/server/config"
import { Category, EventType, ExchangeRate } from "@/lib/types/eventTypes"
import { cn, getEvents, initTranslations, toArabicNums } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { cache } from "react"
import EventBadges from "@/components/shared/EventBadges"
import FormattedPrice from "@/components/shared/FormattedPrice"

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
    exchangeRate: ExchangeRate
}

const countries = {
    'KSA': 'Saudi Arabia',
    'UAE': 'United Arab Emirates',
    'Egypt': 'Egypt'
}

export default async function Search({ search, date, category, country, categories, locale, exchangeRate }: Props)
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
                {events.map(event => {
                    const lowestPrice = Math.min(...event.tickets.map(ticket => ticket.price))
                    
                    return (
                        <div key={event.id} className='relative max-lg:max-w-32 max-lg:min-h-32 lg:min-w-48 lg:min-h-48 rounded-lg overflow-hidden group'>
                            <Link href={`/events/${event.id}`}>
                                <Image
                                    src={event?.displayPageImage}
                                    width={192} 
                                    height={192} 
                                    alt={event.name}
                                    className='object-cover max-lg:max-w-32 max-lg:min-h-32 lg:min-w-48 lg:min-h-48 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out rounded-lg'
                                    loading="lazy"
                                />
                            </Link>
                            
                            {/* Badges */}
                            <EventBadges 
                                event={event} 
                                className="absolute top-2 left-2 z-10" 
                            />
                            
                            {/* Pricing overlay */}
                            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                <div className='text-white'>
                                    <p className='text-xs font-light mb-1'>
                                        {locale === 'ar' ? event.nameArabic : event.name}
                                    </p>
                                    <p className='text-xs font-medium'>
                                        {t('startingFrom')} <FormattedPrice price={lowestPrice} exchangeRate={exchangeRate} />
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}