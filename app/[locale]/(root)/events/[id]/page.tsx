import ImageMotion from "@/components/shared/ImageMotion"
import PurchaseTickets from "@/components/shared/PurchaseTickets"
import { months } from "@/constants"
import { initAdmin } from "@/firebase/server/config"
import { EventType, ExchangeRate } from "@/lib/types/eventTypes"
import { UserType } from "@/lib/types/userTypes"
import { formatTime, getDaySuffix, getExchangeRate, initTranslations, toArabicTime } from "@/lib/utils"
import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"
import Image from "next/image"
import { Suspense, cache } from "react"
import Loading from "./loading"
import ClientDates from "./clientdates"

type Props = {
    params: {
        id: string,
        locale?: string | undefined
    }
}

const getEvent = cache(async (id: string) => {
    const admin = await initAdmin()
    const fetchedEvent = (await admin.firestore().collection('events').doc(id).get())
    const selectedEvent = {
        ...fetchedEvent.data(),
        createdAt: fetchedEvent.data()?.createdAt.toDate(),
        eventTime: fetchedEvent.data()?.eventTime.toDate(),
        eventDate: fetchedEvent.data()?.eventDate.toDate(),
        updatedAt: fetchedEvent.data()?.updatedAt?.toDate(),
        gatesOpen: fetchedEvent.data()?.gatesOpen?.toDate(),
        gatesClose: fetchedEvent.data()?.gatesClose?.toDate(),
    } as EventType
    
    return selectedEvent
})

export async function generateMetadata({ params }: Props) 
{
    const selectedEvent = await getEvent(params.id)

    return {
        title: `${selectedEvent?.name} - Vibes`,
        description: selectedEvent?.description,
    }
}

const getUser = cache(async () => {
    const admin = await initAdmin()
    const cookiesData = cookies()
    const token = await decode({ token: cookiesData.get(process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token')?.value, secret: process.env.NEXTAUTH_SECRET! })


    const user = token?.sub ? (await admin.firestore().collection('users')?.doc(token?.sub as string).get()).data() as UserType : null

    return user
})

export default async function EventPage({ params }: Props) 
{
    const { t } = await initTranslations(params.locale!, ['homepage', 'common'])

    const selectedEvent = await getEvent(params.id)

    const exchangeRate = await getExchangeRate()

    const user = await getUser()

    return (
        <Suspense fallback={<Loading />}>
            <section dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='flex flex-col w-full self-center gap-4 lg:h-[calc(100vh-7rem)] lg:max-h-[750px] lg:flex-row max-lg:items-center mt-16'>
                <div className='flex flex-col w-full max-w-[390px] rounded-xl bg-[rgba(217,217,217,0.2)] gap-1 h-full'>
                    <ImageMotion 
                        selectedEvent={selectedEvent}
                        width={500}
                        height={500}
                        index={parseInt(params.id.toString())}
                        imageClassName="rounded-t-xl"
                        className="w-full object-contain h-full max-h-[212px] overflow-hidden"
                        priority={true}
                        layoutId={params.id.toString()}
                        eventPage={true}
                    />
                    <div className='flex flex-col p-3 gap-4 flex-1'>
                        <p className='font-poppins text-lg lg:text-2xl font-bold text-white'>{params.locale === 'ar' ? selectedEvent?.nameArabic : selectedEvent?.name}</p>
                        <div className='w-full flex justify-between items-center'>
                            <p className='font-poppins text-xs lg:text-md font-extralight text-white'>{params.locale === 'ar' ? selectedEvent?.venueArabic : selectedEvent?.venue}</p>
                            <p className='font-poppins text-xs lg:text-md font-extralight text-white mr-4'>{params.locale === 'ar' ? selectedEvent?.cityArabic : selectedEvent?.city}, {t(`${selectedEvent?.country}`)}</p>
                        </div>
                        <ClientDates selectedEvent={selectedEvent} className='font-poppins text-xs lg:text-md font-extralight text-white' />
                        <p className='font-poppins text-xs lg:text-md font-extralight text-white'>{selectedEvent.gatesOpen && `Gates open ${params.locale === 'ar' ? toArabicTime(formatTime(selectedEvent.gatesOpen)) : formatTime(selectedEvent.gatesOpen)}`} {selectedEvent.gatesClose && `| Gates close ${params.locale === 'ar' ? toArabicTime(formatTime(selectedEvent.gatesClose)) : formatTime(selectedEvent.gatesClose)}`}</p>
                        <div className='flex text-center w-full border-y-[1px] border-[#fff] py-4'>
                            <p className='font-poppins text-xs font-extralight text-white'>{params.locale === 'ar' ? selectedEvent.descriptionArabic : selectedEvent.description}</p>
                        </div>
                        <div className='flex flex-col items-start justify-end w-full gap-6 mb-4 mt-auto flex-1'>
                            {selectedEvent.eventDisclaimers.map((disclaimer, index) => {
                                const disclaimerText = disclaimer.icon.split('.')[0]
                                const disclaimerSvg = disclaimerText === 'disclaimer1' ? '/assets/mask.svg' : '/assets/nochildren.svg'
                                const width = disclaimerText === 'disclaimer1' ? 32 : 28
                                const height = disclaimerText === 'disclaimer1' ? 20 : 28
                                return (
                                    <div key={index} className='flex gap-2 justify-evenly items-center w-full'>
                                        <div className='w-1/6 flex items-center justify-center'>
                                            <Image
                                                src={disclaimerSvg}
                                                width={width}
                                                height={height}
                                                alt={disclaimerText}
                                            />
                                        </div>
                                        <p className='font-poppins leading-4 text-[0.65rem] lg:text-xs font-extralight text-white w-full'>{params.locale === 'ar' ? disclaimer.disclaimerArabic : disclaimer.disclaimer}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <PurchaseTickets locale={params.locale} exchangeRate={exchangeRate} event={selectedEvent} user={user} />
            </section>
        </Suspense>
    )
}
