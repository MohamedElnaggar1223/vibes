import ResellMarketFilters from "@/components/shared/ResellMarketFilters"
import { cn, getHotelReservations, getMyHotelReservations, initTranslations } from "@/lib/utils"
import { Suspense } from "react"
import EventsLoading from "../categories/eventsLoading"
import CategorieResell from "@/components/shared/CategoryResell"
import SearchHotelReservations from "./search-hotel-reservations"
import HotelReservation from "./hotel-reservation"
import { Accordion } from "@/components/ui/accordion"
import { getUser } from "../layout"
import Link from "next/link"
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
    const myHotelReservations = await getMyHotelReservations(user?.id!)

    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

    console.log(myHotelReservations)

    return (
        <section dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='flex flex-col relative flex-1 items-center justify-start p-4 md:p-12 gap-8 md:max-h-screen'>
            <ResellMarketHeaders locale={params.locale} />
            <section dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='flex max-md:flex-col flex-1 w-full gap-6 items-start lg:items-start justify-start mb-16 py-8' key={Math.random()}>
                <div className="flex w-full md:flex-col md:w-[200px] gap-4">
                    <Link href='/hotel-reservations?tab=explore' className={cn('rounded-[4px] font-light py-2 flex-1 max-w-[197px] w-screen px-2 font-poppins text-center flex items-center justify-center', (tab !== 'my-reservations') ? 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] text-white' : 'bg-white text-black')}>{t("explore")}</Link>
                    <Link href='/hotel-reservations?tab=my-reservations' className={cn('rounded-[4px] font-light py-2 flex-1 max-w-[197px] w-screen px-2 font-poppins text-center flex items-center justify-center', tab === 'my-reservations' ? 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] text-white' : 'bg-white text-black')}>{t("myReservations")}</Link>
                </div>
                <div className="flex flex-col flex-1 gap-6 items-start justify-start mx-auto">
                    <div className='flex w-full items-center justify-center'>
                        <SearchHotelReservations search={search} />
                    </div>
                    {
                        tab === 'my-reservations' ? 
                        (myHotelReservations
                        .filter(hotel => search ? hotel.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) : true)
                        .length === 0 ? (
                            <p className='flex items-center justify-center text-white w-full text-lg text-center font-poppins font-semibold h-52 flex-1 max-lg:w-full'>{t('noHotels')}</p>
                        ) : (
                            <Suspense fallback={<EventsLoading />}>
                                <div className='flex flex-col flex-1 gap-8 w-full items-center mt-8'>
                                    <Accordion type='multiple' className="!border-none !divide-none w-full">
                                        {myHotelReservations
                                            .filter(hotel => search ? hotel.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) : true)
                                            .map(hotel => (
                                            <HotelReservation buy={false} user={user!} locale={params.locale} key={hotel.id} hotel={hotel} /> 
                                        ))}
                                    </Accordion>
                                </div>
                            </Suspense>
                        )) :
                        (hotelReservations
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