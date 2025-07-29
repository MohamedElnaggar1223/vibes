import { Category, EventType, ExchangeRate } from "@/lib/types/eventTypes"
import { getEvents, getExchangeRate, initTranslations, toArabicNums } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import EventBadges from "./EventBadges"
import FormattedPrice from "./FormattedPrice"

type Props = {
    category: Category
    categories: Category[]
    events: EventType[]
    locale: string | undefined
    categorySearchParam: string | undefined
    date: string | undefined
    country: 
        'KSA' |
        'UAE' |
        'Egypt' 
     | undefined,
}

const countries = {
    'KSA': 'Saudi Arabia',
    'UAE': 'United Arab Emirates',
    'Egypt': 'Egypt'
}

export default async function Categorie({ category, events, country, date, locale, categories, categorySearchParam }: Props) 
{
    const { t } = await initTranslations(locale!, ['homepage', 'common', 'auth'])
    const catEvents = events
                        .filter(event => event.categoryID === category.id)
                        .filter(event => date ? event.eventDate.toISOString().includes(date) : true)
                        .filter(event => country ? (event.country === countries[country]) : true)
                        .filter(event => categorySearchParam ? categories.find(cat => cat.id === event.categoryID)?.category === categorySearchParam : true)

    const exchangeRate = await getExchangeRate()

    if(catEvents.length === 0) return null
    else return (
        <div className='flex flex-1 flex-col gap-4 mt-6'>
            <div className='flex flex-col gap-0.5'>
                <p className='font-poppins text-white text-md lg:text-base font-semibold'>{locale === 'ar' ? category.categoryArabic : category.category} <span className='font-extralight text-sm'>({locale === 'ar' ? toArabicNums(`${catEvents.length}`) : catEvents.length})</span></p>
                <div className='w-10 h-px bg-white' />
            </div>
            <div className='w-full flex justify-start lg:items-center gap-6 lg:gap-8 flex-wrap max-md:justify-start'>
                {catEvents.map(event => {
                    const lowestPrice = Math.min(...event.tickets.map(ticket => ticket.price))
                    
                    return (
                        <div key={event.id} className='relative min-w-32 min-h-32 lg:min-w-48 lg:min-h-48 rounded-lg overflow-hidden group'>
                            <Link href={`/events/${event.id}`}>
                                <Image
                                    src={event?.displayPageImage}
                                    width={192} 
                                    height={192} 
                                    alt={event.name}
                                    className='object-cover max-lg:max-w-32 max-lg:max-h-32 min-w-32 min-h-32 lg:min-w-48 lg:min-h-48 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out rounded-lg'
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
        </div>
    )
}