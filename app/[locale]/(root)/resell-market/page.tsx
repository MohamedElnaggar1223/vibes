import ResellMarketFilters from "@/components/shared/ResellMarketFilters"
import { cn, getCategories, getEventsResell, initTranslations } from "@/lib/utils"
import { Suspense } from "react"
import EventsLoading from "../categories/eventsLoading"
import CategorieResell from "@/components/shared/CategoryResell"
import ResellMarketHeaders from "./resell-market-headers"

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
    params: {
        locale?: string | undefined
    }
}

const countries = {
    'KSA': 'Saudi Arabia',
    'UAE': 'United Arab Emirates',
    'Egypt': 'Egypt'
}

export default async function ResellMarket({ searchParams, params }: Props) 
{
    const { t } = await initTranslations(params.locale!, ['homepage', 'common', 'auth'])

    const events = await getEventsResell()
    const categories = await getCategories()

    const date = typeof searchParams.date === 'string' ? searchParams.date : undefined
    const country = typeof searchParams.country === 'string' && (searchParams.country === 'UAE' || searchParams.country === 'Egypt' || searchParams.country === 'KSA') ? searchParams.country : undefined

    return (
        <section dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='flex flex-col relative flex-1 items-center justify-start p-4 md:p-12 gap-8 md:max-h-screen'>
            <ResellMarketHeaders locale={params.locale} />
            <section dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='flex max-lg:flex-col flex-1 w-full gap-6 items-start lg:items-start justify-start mb-16' key={Math.random()}>
                <div className='flex lg:flex-col mt-2 lg:mt-16 gap-1 w-full lg:w-48'>
                    <p className='font-poppins text-white font-light max-lg:hidden'>{t('filters')}</p>
                    <ResellMarketFilters locale={params.locale} />
                </div>
                {
                    events
                    .filter(event => date ? event.eventDate.toISOString().includes(date) : true)
                    .filter(event => country ? (event.country === countries[country]) : true)
                    .length === 0 ? (
                        <p className='flex items-center justify-center text-white text-lg text-center font-poppins font-semibold h-52 flex-1 max-lg:w-full'>{t('noEvents')}</p>
                    ) : (
                        <Suspense fallback={<EventsLoading />}>
                            <div className='flex flex-col flex-1 gap-8'>
                                {categories.map(cat => (
                                    <CategorieResell locale={params.locale} key={cat.id} category={cat} categories={categories} categorySearchParam={undefined} events={events} country={country} date={date} /> 
                                ))}
                            </div>
                        </Suspense>
                    )
                }
            </section>
        </section>
    )
}