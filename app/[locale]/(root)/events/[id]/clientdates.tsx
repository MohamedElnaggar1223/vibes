'use client'
import { months } from "@/constants";
import { EventType } from "@/lib/types/eventTypes";
import { getDaySuffix, formatTime, toArabicDate, toArabicTime } from "@/lib/utils";

export default function ClientDates({ selectedEvent, className, locale }: { selectedEvent: EventType, className: string, locale: string | undefined })
{
    return (
        <p className={className}>{locale === 'ar' ? toArabicDate(`${months[selectedEvent.eventDate?.getMonth()]}, ${getDaySuffix(selectedEvent.eventDate?.getDate())}, ${selectedEvent.eventDate?.getFullYear()}`) : `${months[selectedEvent.eventDate?.getMonth()]}, ${getDaySuffix(selectedEvent.eventDate?.getDate())}, ${selectedEvent.eventDate?.getFullYear()}`} | {locale === 'ar' ? toArabicTime(formatTime(selectedEvent.eventTime)) : formatTime(selectedEvent.eventTime)} {selectedEvent.timeZone}</p>
    )
}