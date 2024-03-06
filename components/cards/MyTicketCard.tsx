import { months } from "@/constants"
import { EventType } from "@/lib/types/eventTypes"
import { TicketType } from "@/lib/types/ticketTypes"
import { getDaySuffix, formatTime } from "@/lib/utils"
// import { QrCode } from "lucide-react"
import QRCode from "react-qr-code"
import Image from "next/image"

type Props = {
    ticket: TicketType,
    event: EventType
}

export default function MyTicketCard({ ticket, event }: Props)
{

    return (
        <div className='rounded-lg flex w-full min-h-44 max-h-44 bg-[rgba(217,217,217,0.2)] p-0 overflow-hidden gap-8'>
            <Image
                src={event.displayPageImage}
                height={176}
                width={176}
                alt={event.name}
                className='min-w-44 min-h-44 object-fill'
            />
            <div className='flex gap-4 items-center justify-between w-full'>
                <div className='flex flex-col gap-3 py-2'>
                    <p className='font-poppins font-bold text-2xl text-white'>{event.name}</p>
                    <p className='font-poppins text-base font-extralight text-white'>{`${months[event.eventDate?.getMonth()]}, ${getDaySuffix(event.eventDate?.getDate())}, ${event.eventDate?.getFullYear()}`} | {formatTime(event.eventTime)} {event.timeZone}</p>
                    <div className='w-full flex justify-between items-center gap-6'>
                        <p className='font-poppins text-base font-extralight text-white'>{event?.venue}</p>
                        <p className='font-poppins text-base font-extralight text-white'>|</p>
                        <p className='font-poppins text-base font-extralight text-white'>{event?.city}, {event?.country}</p>
                    </div>
                    <p className='font-poppins text-base font-extralight text-white'>{event.gatesOpen && `Gates open ${formatTime(event.gatesOpen)}`} {event.gatesClose && `| Gates close ${formatTime(event.gatesClose)}`}</p>
                </div>
                <div className='flex flex-col gap-3 pb-4 pt-10 h-full w-fit text-nowrap'>
                    {Object.keys(ticket.tickets).slice().filter(ticketKey => ticket.tickets[ticketKey] > 0).map(ticketKey => <p className='font-poppins text-base font-normal text-white'>{ticketKey} <span className='font-extralight ml-2'>x{ticket.tickets[ticketKey]}</span></p>)}
                </div>
                <div className='flex h-full items-center justify-center qrcodeHeight'>
                    {/* <QrCode values="sadawddwadaw" /> */}
                    <QRCode value={ticket.id} height='90%' />
                </div>
            </div>
        </div>
    )
}