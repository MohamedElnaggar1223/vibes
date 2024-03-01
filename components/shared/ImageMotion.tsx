'use client'

import { EventType } from "@/lib/types/eventTypes"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"

type Props = {
    selectedEvent: EventType
    className?: string,
    imageClassName?: string,
    index?: number,
    width: number,
    height: number,
    priority?: boolean,
    layoutId?: string,
    eventPage: boolean
}

export default function ImageMotion({ selectedEvent, className, width, height, imageClassName, priority, layoutId, eventPage }: Props) 
{
    return (
        <AnimatePresence>
            <motion.div layoutId={layoutId} className={cn(className)}>
                <Image
                    src={eventPage ? selectedEvent.eventPageImage : selectedEvent?.displayPageImage}
                    width={width}
                    height={height}
                    alt={selectedEvent?.name}
                    priority={priority ?? false}
                    className={cn(imageClassName)}
                />
            </motion.div>
        </AnimatePresence>
    )
}
