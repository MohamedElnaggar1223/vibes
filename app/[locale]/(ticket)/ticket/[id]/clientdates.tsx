'use client'
import { EventType } from "@/lib/types/eventTypes";
import { formatTime } from "@/lib/utils";

export default function ClientDates({ selectedEvent, className }: { selectedEvent: EventType, className: string })
{
    return (
        <p className={className}>{formatTime(selectedEvent.eventTime)} {selectedEvent.timeZone}</p>
    )
}