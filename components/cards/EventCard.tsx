import { months } from "@/constants";
import { cn, getDaySuffix } from "@/lib/utils";
import { EventType, ExchangeRate } from "@/lib/types/eventTypes";
import FormattedPrice from "../shared/FormattedPrice";
import ImageMotion from "../shared/ImageMotion";
import { CarouselItem } from "../ui/carousel";
import Link from "next/link";

type Props = {
    event: EventType,
    exchangeRate: ExchangeRate
}

export default async function EventCard({ event, exchangeRate }: Props) 
{
    return (
        <CarouselItem key={event.id} className={cn('group relative max-h-48 max-w-48 lg:max-h-[412px] lg:max-w-[412px] h-full w-full')}>
            <ImageMotion
                selectedEvent={event}
                className='object-cover'
                width={412}
                height={412} 
                imageClassName="object-cover"
                priority={true}
                layoutId={event.id}
                eventPage={false}
            />
            <div className='absolute max-lg:hidden flex z-[9999] bg-gradient-to-t from-black from-30% via-black/75 to-slate-900/25 w-[calc(100%-1rem)] h-full opacity-0 text-lg group-hover:opacity-100 bottom-0 right-[0%] duration-300 cursor-pointer'>
                <Link href={`/events/${event.id}`} className='absolute w-full h-full'/>
                <div className='flex flex-col gap-4 text-white mt-auto w-full h-fit pr-6 pb-3'>
                    <div className='flex flex-col justify-center items-start gap-2 h-full pl-2 border-l-[8px] border-[#E72377]'>
                        <p className='font-poppins text-sm font-normal'>{event.name}</p>
                        <p className='font-poppins text-xs font-light'>{event.venue}</p>
                        <p className='font-poppins text-xs font-light'>{`${months[event.eventDate?.getMonth()]}, ${getDaySuffix(event.eventDate?.getDate())}, ${event.eventDate?.getFullYear()}`}</p>
                        <div className='w-full flex justify-between items-center'>
                            <p className='font-poppins text-xs font-light'>{event.city}, {event.country}</p>
                            <p className='font-poppins text-xs font-light'><span className='font-extralight mr-2'>starting from </span>{<FormattedPrice price={event.tickets[0].price} exchangeRate={exchangeRate} />}</p>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-end'>
                        <button className='font-poppins text-[16px] bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-fit px-3 py-2 text-white'>
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </CarouselItem>
    )
}