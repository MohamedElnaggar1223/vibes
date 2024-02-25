'use client'

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"

type Props = {
    selectedEvent: {
        imgUrl: string,
        title: string,
        price: string,
    },
    className?: string,
    imageClassName?: string,
    index?: number,
    width: number,
    height: number,
    priority?: boolean,
    layoutId?: string
}

export default function ImageMotion({ selectedEvent, className, index, width, height, imageClassName, priority, layoutId }: Props) 
{
    return (
        <AnimatePresence>
            <motion.div layoutId={layoutId} className={cn(className)}>
                <Image
                    src={selectedEvent?.imgUrl}
                    width={width}
                    height={height}
                    alt={selectedEvent?.title}
                    priority={priority ?? false}
                    className={cn(imageClassName)}
                />
            </motion.div>
        </AnimatePresence>
    )
}
