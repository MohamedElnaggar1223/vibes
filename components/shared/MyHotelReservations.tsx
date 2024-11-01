import { getUser } from "@/app/[locale]/(root)/layout"
import { getMyHotelReservations, initTranslations } from "@/lib/utils"
import { Suspense } from "react"
import { Accordion } from "../ui/accordion"
import HotelReservation from "@/app/[locale]/(root)/hotel-reservations/hotel-reservation"
import useSWR from "swr"
import { useTranslation } from "react-i18next"
import { UserType } from "@/lib/types/userTypes"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/firebase/client/config"
import { Hotel } from "@/lib/types/hotelTypes"

export default async function MyHotelReservations({ params, user }: { params: { locale?: string | undefined }, user: UserType })
{
    const { t } = useTranslation()

    const { data: myHotelReservations } = useSWR('hotelReservations', async (...args) => {
        if(!user) return []

        const hotelReservationsCollection = collection(db, 'hotels')
        
        const queryHotelReservations = query(hotelReservationsCollection, where('buyerId', '==', user.id))

        const hotelReservationsSnapshot = await getDocs(queryHotelReservations)

        const hotelReservations = hotelReservationsSnapshot.docs.map(doc => ({...doc.data(), id: doc.id, date: { from: doc.data().date.from.toDate(), to: doc.data().date.to.toDate() }})) as unknown as Hotel[]

        return hotelReservations
    })

    return (
            (myHotelReservations
            ?.length === 0 ? (
                <p className='flex items-center justify-center text-white w-full text-lg text-center font-poppins font-semibold h-52 flex-1 max-lg:w-full'>{t('noHotels')}</p>
            ) : (
                <Suspense fallback={<></>}>
                    <div className='flex flex-col flex-1 gap-8 w-full items-center mt-8'>
                        <Accordion type='multiple' className="!border-none !divide-none w-full">
                            {myHotelReservations
                                ?.map(hotel => (
                                <HotelReservation buy={false} user={user!} locale={params.locale} key={hotel.id} hotel={hotel} /> 
                            ))}
                        </Accordion>
                    </div>
                </Suspense>
            )) 
    )
}