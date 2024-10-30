import ResellMarketFilters from "@/components/shared/ResellMarketFilters"
import { getHotelReservations, initTranslations } from "@/lib/utils"
import { Suspense } from "react"
import EventsLoading from "../categories/eventsLoading"
import CategorieResell from "@/components/shared/CategoryResell"
import SearchHotelReservations from "./search-hotel-reservations"
import HotelReservation from "./hotel-reservation"
import { Accordion } from "@/components/ui/accordion"
import { getUser } from "../layout"

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

export default async function HotelReservations({ searchParams, params }: Props) 
{
    const { t } = await initTranslations(params.locale!, ['homepage', 'common', 'auth'])

    const user = await getUser()

    const hotelReservations = await getHotelReservations()

    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

    console.log(hotelReservations)

    return (
        <section dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='flex flex-col flex-1 w-full gap-6 items-start lg:items-start justify-start mb-16 py-8' key={Math.random()}>
            <div className='flex w-full items-center justify-center'>
                <SearchHotelReservations search={search} />
            </div>
            {
                hotelReservations
                .filter(hotel => search ? hotel.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) : true)
                .length === 0 ? (
                    <p className='flex items-center justify-center text-white w-full text-lg text-center font-poppins font-semibold h-52 flex-1 max-lg:w-full'>{t('noHotels')}</p>
                ) : (
                    <Suspense fallback={<EventsLoading />}>
                        <div className='flex flex-col flex-1 gap-8 w-full items-center mt-8'>
                            <Accordion type='multiple' className="!border-none !divide-none w-full">
                                {hotelReservations
                                    .filter(hotel => search ? hotel.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) : true)
                                    .map(hotel => (
                                    <HotelReservation user={user!} locale={params.locale} key={hotel.id} hotel={hotel} /> 
                                ))}
                            </Accordion>
                        </div>
                    </Suspense>
                )
            }
        </section>
    )
}