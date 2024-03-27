'use client'
import { months } from "@/constants";
import { EventType } from "@/lib/types/eventTypes";
import { getDaySuffix, formatTime } from "@/lib/utils";

export default function ClientDates({ selectedEvent }: { selectedEvent: EventType })
{
    return (
        <p className='font-poppins text-xs lg:text-md font-extralight text-white'>{`${months[selectedEvent.eventDate?.getMonth()]}, ${getDaySuffix(selectedEvent.eventDate?.getDate())}, ${selectedEvent.eventDate?.getFullYear()}`} | {formatTime(selectedEvent.eventTime)} {selectedEvent.timeZone}</p>
    )
}