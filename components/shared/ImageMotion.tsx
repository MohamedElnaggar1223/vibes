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
}

export default function ImageMotion({ selectedEvent, className, index, width, height, imageClassName }: Props) 
{
    return (
        <AnimatePresence>
            <motion.div layoutId={index?.toString()} className={cn(className)}>
                <Image
                    src={selectedEvent.imgUrl}
                    width={width}
                    height={height}
                    alt={selectedEvent.title}
                    priority
                    className={cn(imageClassName)}
                />
            </motion.div>
        </AnimatePresence>
    )
}
