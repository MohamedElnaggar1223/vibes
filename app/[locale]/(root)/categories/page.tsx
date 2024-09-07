import type { Metadata } from 'next'
import CategoriesFilters from "@/components/shared/CategoriesFilters";
import Categorie from "@/components/shared/Category";
import { getCategories, getEvents, initTranslations } from "@/lib/utils";
import { Suspense } from "react";
import EventsLoading from "./eventsLoading";

export const metadata: Metadata = {
    title: 'Categories - Whim Zee',
    description: 'Find the best events in KSA, UAE, or Egypt!',
}

type Props = {
    searchParams: { [key: string]: string | string[] | undefined },
    params: {
        locale?: string | undefined
    }
}

const countries = {
    'KSA': 'Saudi Arabia',
    'UAE': 'United Arab Emirates',
    'Egypt': 'Egypt'
}

export default async function CategoriesPage({ searchParams, params }: Props) 
{
    const { t } = await initTranslations(params.locale!, ['homepage', 'common', 'auth'])

    const categories = await getCategories()
    const events = await getEvents()

    const date = typeof searchParams.date === 'string' ? searchParams.date : undefined
    const country = typeof searchParams.country === 'string' && (searchParams.country === 'UAE' || searchParams.country === 'Egypt' || searchParams.country === 'KSA') ? searchParams.country : undefined
    let category = typeof searchParams.category === 'string' ? searchParams.category : undefined

    category = category === 'Theatre ' ? 'Theatre & comedy' : category

    return (
        <section dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='flex max-lg:flex-col flex-1 w-full gap-6 items-start lg:items-start justify-start mb-16' key={Math.random()}>
            <div className='flex lg:flex-col mt-2 lg:mt-16 gap-1 w-full lg:w-48'>
                <p className='font-poppins text-white font-light max-lg:hidden'>{t('filters')}</p>
                <CategoriesFilters locale={params.locale} categories={categories} />
            </div>
            {
                events
                .filter(event => date ? event.eventDate.toISOString().includes(date) : true)
                .filter(event => country ? (event.country === countries[country]) : true)
                .filter(event => category ? categories.find(cat => cat.id === event.categoryID)?.category === category : true)
                .length === 0 ? (
                    <p className='flex items-center justify-center text-white text-lg text-center font-poppins font-semibold h-52 flex-1 max-lg:w-full'>{t('noEvents')}</p>
                ) : (
                    <Suspense fallback={<EventsLoading />}>
                        <div className='flex flex-col flex-1 gap-8'>
                            {categories.map(cat => (
                                <Categorie locale={params.locale} key={cat.id} category={cat} categories={categories} categorySearchParam={category} events={events} country={country} date={date} /> 
                            ))}
                        </div>
                    </Suspense>
                )
            }
        </section>
    )
}