import HotelReservationsFilters from "@/components/shared/HotelReservationsFilters"
import { cn, getHotelReservations, getMyHotelReservations, initTranslations } from "@/lib/utils"
import { Suspense } from "react"
import EventsLoading from "../categories/eventsLoading"
import HotelReservation from "./hotel-reservation"
import { Accordion } from "@/components/ui/accordion"
import { getUser } from "../layout"
import ResellMarketHeaders from "../resell-market/resell-market-headers"

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
    const tab = typeof searchParams.tab === 'string' ? searchParams.tab : undefined

    const { t } = await initTranslations(params.locale!, ['homepage', 'common', 'auth'])

    const user = await getUser()

    const hotelReservations = await getHotelReservations()
    const myHotelReservations = user ? await getMyHotelReservations(user?.id!) : []

    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
    const country = typeof searchParams.country === 'string' ? searchParams.country : undefined
    const date = typeof searchParams.date === 'string' ? searchParams.date : undefined

    return (
        <section dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='flex flex-col relative flex-1 items-center justify-start p-4 md:p-12 gap-8 md:max-h-screen'>
            <ResellMarketHeaders locale={params.locale} />
            <section dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='relative flex max-lg:flex-col flex-1 w-full gap-6 items-start lg:items-start justify-start mb-16 overflow-auto' key={Math.random()}>
                <div className='flex lg:flex-col mt-2 lg:mt-16 gap-1 w-full lg:w-48 sticky top-0'>
                    <p className='font-poppins text-white font-light max-lg:hidden'>{t('filters')}</p>
                    <HotelReservationsFilters locale={params.locale} />
                </div>
                <div className="flex flex-col flex-1 gap-6 items-start justify-start mx-auto">
                    {
                        // (tab === 'my-reservations' && user) ? 
                        // (myHotelReservations
                        // .filter(hotel => date ? hotel.date.from < new Date(date) && hotel.date.to > new Date(date) : true)
                        // .filter(hotel => country ? (hotel.country === country) : true)
                        // .length === 0 ? (
                        //     <p className='flex items-center justify-center text-white w-full text-lg text-center font-poppins font-semibold h-52 flex-1 max-lg:w-full'>{t('noHotels')}</p>
                        // ) : (
                        //     <Suspense fallback={<EventsLoading />}>
                        //         <div className='flex flex-col flex-1 gap-8 w-full items-center mt-8'>
                        //             <Accordion type='multiple' className="!border-none !divide-none w-full">
                        //                 {myHotelReservations
                        //                     .filter(hotel => date ? hotel.date.from < new Date(date) && hotel.date.to > new Date(date) : true)
                        //                     .filter(hotel => country ? (hotel.country === country) : true)
                        //                     .map(hotel => (
                        //                     <HotelReservation buy={false} user={user!} locale={params.locale} key={hotel.id} hotel={hotel} /> 
                        //                 ))}
                        //             </Accordion>
                        //         </div>
                        //     </Suspense>
                        // )) :
                        (hotelReservations
                        .filter(hotel => date ? hotel.date.from < new Date(date) && hotel.date.to > new Date(date) : true)
                        .filter(hotel => country ? (hotel.country === country) : true)
                        .length === 0 ? (
                            <p className='flex items-center justify-center text-white w-full text-lg text-center font-poppins font-semibold h-52 flex-1 max-lg:w-full'>{t('noHotels')}</p>
                        ) : (
                            <Suspense fallback={<EventsLoading />}>
                                <div className='flex flex-col flex-1 gap-8 w-full items-center mt-8'>
                                    <Accordion type='multiple' className="!border-none !divide-none w-full">
                                        {hotelReservations
                                            .filter(hotel => date ? hotel.date.from < new Date(date) && hotel.date.to > new Date(date) : true)
                                            .filter(hotel => country ? (hotel.country === country) : true)
                                            .map(hotel => (
                                            <HotelReservation buy={true} user={user!} locale={params.locale} key={hotel.id} hotel={hotel} /> 
                                        ))}
                                    </Accordion>
                                </div>
                            </Suspense>
                        ))
                    }
                </div>
            </section>
        </section>
    )
}