'use client'
import { events } from "@/constants"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function EventPage() 
{
    const { index } = useParams()
    const selectedEvent = events[parseInt(index.toString())]

    return (
        <AnimatePresence presenceAffectsLayout>
            <section className='flex w-full'>
                <motion.div layoutId={index.toString()} className='w-[500px] p-5'>
                    <Image
                        src={selectedEvent.imgUrl}
                        width={500}
                        height={500}
                        alt={selectedEvent.title}
                        priority
                    />
                </motion.div>
                <div className='flex-1'>
                    Hello
                </div>
            </section>
        </AnimatePresence>
    )
}
