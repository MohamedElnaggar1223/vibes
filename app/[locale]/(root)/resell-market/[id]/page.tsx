import { getEvent, getExchangeRate, initTranslations } from "@/lib/utils"
import { getUser } from "../../layout"
import { ChevronLeft, Loader2 } from "lucide-react"
import { Suspense } from "react"
import Image from "next/image"
import ImageMotion from "@/components/shared/ImageMotion"
import ClientDates from "../../events/[id]/clientdates"
import Link from "next/link"
import PurchaseResellTickets from "@/components/shared/PurchaseResellTickets"
import { initAdmin } from "@/firebase/server/config"
import { Bundle, TicketType } from "@/lib/types/ticketTypes"

type Props = {
    params: {
        id: string
        locale?: string | undefined
    }
}

export default async function ResellEventPage({ params }: Props) 
{
    const { t } = await initTranslations(params.locale!, ['homepage', 'common'])
    
    const selectedEvent = await getEvent(params.id)

    if(!selectedEvent) return <div>Event not found</div>
    if(!selectedEvent.reselling) return <div>Event not found</div>

    const exchangeRate = await getExchangeRate()
    const user = await getUser()

    const admin = await initAdmin()

    const ticketsCollection = admin.firestore().collection('tickets')
    const bundlesCollection = admin.firestore().collection('bundles')

    const ticketsForSale = (await ticketsCollection.where('forSale', '==', true).where('saleStatus', '==', 'onSale').where('userId', '!=', user?.id ?? '').where('eventId', '==', selectedEvent.id).get()).docs.filter(doc => doc.data()?.forSale).map(doc => ({...doc.data(), id: doc.id, createdAt: doc.data()?.createdAt.toDate()})) as TicketType[]
    const bundlesForSale = (await bundlesCollection.where('userId', '!=', user?.id ?? '').where('eventId', '==', selectedEvent.id).get()).docs.map(doc => ({...doc.data(), id: doc.id, createdAt: doc.data()?.createdAt.toDate()})) as Bundle[]

    const bundlesWithTickets = await Promise.all(bundlesForSale.map(async (bundle) => {
        const tickets = await ticketsCollection.where('bundleID', '==', bundle.id).where('userId', '!=', user?.id ?? '').where('eventId', '==', selectedEvent.id).get()
        return {...bundle, tickets: tickets.docs.map(doc => ({...doc.data(), id: doc.id, createdAt: doc.data()?.createdAt.toDate()})) as TicketType[]}
    }))

    return (
        <Suspense fallback={<Loader2 size={52} className='animate-spin' />}>
            <section dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='flex relative flex-col w-full self-center gap-4 lg:h-[calc(100vh-7rem)] lg:max-h-[750px] lg:flex-row max-lg:items-center mt-16'>
                <Link className='absolute -left-16 top-2 w-9 h-9 text-white bg-[#FFFFFF80] flex items-center justify-center rounded-[5px]' href='/resell-market'><ChevronLeft size={24} /></Link>
                <div className='flex flex-col w-full max-w-[390px] rounded-xl bg-[rgba(217,217,217,0.2)] gap-1 h-fit'>
                    <ImageMotion
                        selectedEvent={selectedEvent}
                        width={500}
                        height={500}
                        index={parseInt(params.id.toString())}
                        imageClassName="rounded-t-xl"
                        className="w-full object-contain h-full min-h-[180px] max-h-[212px] overflow-hidden"
                        priority={true}
                        layoutId={params.id.toString()}
                        eventPage={true}
                    />
                    <div className='flex flex-col p-3 gap-4 flex-1 overflow-auto'>
                        <p className='font-poppins text-lg lg:text-2xl font-bold text-white'>{params.locale === 'ar' ? selectedEvent?.nameArabic : selectedEvent?.name}</p>
                        <div className='w-full flex justify-between items-center'>
                            <p className='font-poppins text-xs lg:text-md font-extralight text-white'>{params.locale === 'ar' ? selectedEvent?.venueArabic : selectedEvent?.venue}</p>
                            <p className='font-poppins text-xs lg:text-md font-extralight text-white mr-4'>{params.locale === 'ar' ? selectedEvent?.cityArabic : selectedEvent?.city}, {t(`${selectedEvent?.country.replaceAll(" ", "")}`)}</p>
                        </div>
                        <ClientDates locale={params.locale} selectedEvent={selectedEvent} className='font-poppins text-xs lg:text-md font-extralight text-white' />
                    </div>
                </div>
                {/* <PurchaseTickets locale={params.locale} exchangeRate={exchangeRate} event={selectedEvent} user={user} /> */}
                <PurchaseResellTickets bundlesWithTickets={bundlesWithTickets} locale={params.locale} exchangeRate={exchangeRate} event={selectedEvent} ticketsForSale={ticketsForSale} bundlesForSale={bundlesForSale} user={user} />
            </section>
        </Suspense>
    )
}