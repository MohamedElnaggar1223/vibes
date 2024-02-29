import ImageMotion from "@/components/shared/ImageMotion"
import PurchaseTickets from "@/components/shared/PurchaseTickets"
import { months } from "@/constants"
import { initAdmin } from "@/firebase/server/config"
import { EventType, ExchangeRate } from "@/lib/types/eventTypes"
import { UserType } from "@/lib/types/userTypes"
import { formatTime, getDaySuffix } from "@/lib/utils"
import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"
import Image from "next/image"

type Props = {
    params: {
        id: string
    }
}

export default async function EventPage({ params }: Props) 
{
    const admin = await initAdmin()
    const fetchedEvent = (await admin.firestore().collection('events').doc(params.id).get())
    const selectedEvent = {
        ...fetchedEvent.data(),
        createdAt: fetchedEvent.data()?.createdAt.toDate(),
        eventTime: fetchedEvent.data()?.eventTime.toDate(),
        eventDate: fetchedEvent.data()?.eventDate.toDate(),
        updatedAt: fetchedEvent.data()?.updatedAt?.toDate(),
    } as EventType

    const exchangeRate = await (await admin.firestore().collection('rates').get()).docs.map(doc => ({...doc.data(), updatedAt: doc.data().updatedAt.toDate()}))[0] as ExchangeRate

    const cookiesData = cookies()
    const token = await decode({ token: cookiesData.get(process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token')?.value, secret: process.env.NEXTAUTH_SECRET! })


    const user = token?.sub ? (await admin.firestore().collection('users')?.doc(token?.sub as string).get()).data() as UserType : null

    return (
        <section className='flex flex-col w-full self-center gap-4 lg:h-[calc(100vh-7rem)] lg:max-h-[750px] lg:flex-row max-lg:items-center mt-24'>
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
                />
                <div className='flex flex-col p-3 gap-4 flex-1'>
                    <p className='font-poppins text-2xl font-bold text-white'>{selectedEvent?.name}</p>
                    <div className='w-full flex justify-between items-center'>
                        <p className='font-poppins text-md font-extralight text-white'>{selectedEvent?.venue}</p>
                        <p className='font-poppins text-md font-extralight text-white mr-4'>{selectedEvent?.city}, {selectedEvent?.country}</p>
                    </div>
                    <p className='font-poppins text-md font-extralight text-white'>{`${months[selectedEvent.eventDate?.getMonth()]}, ${getDaySuffix(selectedEvent.eventDate?.getDate())}, ${selectedEvent.eventDate?.getFullYear()}`} | {formatTime(selectedEvent.eventTime)} {selectedEvent.timeZone}</p>
                    {(selectedEvent.gatesOpen && selectedEvent.gatesClose) && <p className='font-poppins text-md font-extralight text-white'>Gates open {selectedEvent.gatesOpen} | Gates close {selectedEvent.gatesClose}</p>}
                    <div className='flex text-center w-full border-y-[1px] border-[#fff] py-4'>
                        <p className='font-poppins text-xs font-extralight text-white'>{selectedEvent.description}</p>
                    </div>
                    <div className='flex flex-col items-start justify-end w-full gap-6 mb-4 mt-auto flex-1'>
                        {selectedEvent.eventDisclaimers.map(disclaimer => {
                            const disclaimerText = disclaimer.icon.split('.')[0]
                            const disclaimerSvg = disclaimerText === 'disclaimer1' ? '/assets/mask.svg' : '/assets/nochildren.svg'
                            const width = disclaimerText === 'disclaimer1' ? 32 : 28
                            const height = disclaimerText === 'disclaimer1' ? 20 : 28
                            return (
                                <div className='flex gap-2 justify-evenly items-center w-full'>
                                    <div className='w-1/6 flex items-center justify-center'>
                                        <Image
                                            src={disclaimerSvg}
                                            width={width}
                                            height={height}
                                            alt={disclaimerText}
                                        />
                                    </div>
                                    <p className='font-poppins text-xs font-extralight text-white w-full'>{disclaimer.disclaimer}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <PurchaseTickets exchangeRate={exchangeRate} event={selectedEvent} user={user} />
        </section>
    )
}
