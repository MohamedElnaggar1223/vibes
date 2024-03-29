import type { Metadata } from 'next'
import CategoriesFilters from "@/components/shared/CategoriesFilters";
import Categorie from "@/components/shared/Category";
import { getCategories, getEvents } from "@/lib/utils";
import { Suspense } from "react";
import Loading from "./loading";
import EventsLoading from "./eventsLoading";

export const metadata: Metadata = {
    title: 'Categories - Vibes',
    description: 'Find the best events in KSA, UAE, or Egypt!',
}

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}

const countries = {
    'KSA': 'Saudi Arabia',
    'UAE': 'United Arab Emirates',
    'Egypt': 'Egypt'
}

export default async function CategoriesPage({ searchParams }: Props) 
{
    const categories = await getCategories()
    const events = await getEvents()

    const date = typeof searchParams.date === 'string' ? searchParams.date : undefined
    const country = typeof searchParams.country === 'string' && (searchParams.country === 'UAE' || searchParams.country === 'Egypt' || searchParams.country === 'KSA') ? searchParams.country : undefined

    return (
        <section className='flex max-lg:flex-col flex-1 w-full gap-6 items-start lg:items-start justify-start' key={Math.random()}>
            <div className='flex lg:flex-col mt-2 lg:mt-16 gap-2 w-full lg:w-48'>
                <p className='font-poppins text-white font-light max-lg:hidden'>Filters</p>
                <CategoriesFilters />
            </div>
            {
                events
                .filter(event => date ? event.eventDate.toISOString().includes(date) : true)
                .filter(event => country ? (event.country === countries[country]) : true)
                .length === 0 ? (
                    <p className='flex items-center justify-center text-white text-lg text-center font-poppins font-semibold h-52 flex-1'>No Events Found!</p>
                ) : (
                    <Suspense fallback={<EventsLoading />}>
                        <div className='flex flex-col flex-1 gap-8'>
                            {categories.map(category => (
                                <Categorie key={category.id} category={category} events={events} country={country} date={date} /> 
                            ))}
                        </div>
                    </Suspense>
                )
            }
        </section>
    )
}