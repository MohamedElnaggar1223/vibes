'use client'
import { months } from "@/constants";
import { EventType } from "@/lib/types/eventTypes";
import { getDaySuffix, formatTime } from "@/lib/utils";

export default function ClientDates({ selectedEvent, className }: { selectedEvent: EventType, className: string })
{
    return (
        <p className={className}>{`${months[selectedEvent.eventDate?.getMonth()]}, ${getDaySuffix(selectedEvent.eventDate?.getDate())}, ${selectedEvent.eventDate?.getFullYear()}`} | {formatTime(selectedEvent.eventTime)} {selectedEvent.timeZone}</p>
    )
}