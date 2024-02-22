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
            <section className='flex w-full my-8'>
                <div className='flex flex-col w-full max-w-[412px] rounded-xl bg-[rgba(217,217,217,0.2)] gap-1'>
                    <motion.div layoutId={index.toString()} className='w-full object-contain h-full max-h-[212px] overflow-hidden'>
                        <Image
                            src={selectedEvent.imgUrl}
                            width={500}
                            height={500}
                            alt={selectedEvent.title}
                            priority
                            className='rounded-t-xl'
                        />
                    </motion.div>
                    <div className='flex flex-col p-3 gap-4'>
                        <p className='font-poppins text-2xl font-bold text-white'>{selectedEvent.title}</p>
                        <div className='w-full flex justify-between items-center'>
                            <p className='font-poppins text-sm font-extralight text-white'>Al Manara Arena</p>
                            <p className='font-poppins text-sm font-extralight text-white mr-4'>Cairo, Egypt</p>
                        </div>
                        <p className='font-poppins text-sm font-extralight text-white'>August, 1, 2024 | 8:30 PM GMT</p>
                        <p className='font-poppins text-sm font-extralight text-white'>Gates open 4:30PM | Gates close 7:00 PM</p>
                        <div className='flex text-center w-full border-y-[1px] border-[#fff] py-4'>
                            <p className='font-poppins text-sm font-extralight text-white'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui offici.</p>
                        </div>
                        <div className='flex flex-col items-start justify-center w-full gap-4'>
                            <div className='flex gap-2 justify-evenly items-center w-full'>
                                <div className='w-1/6 flex items-center justify-center'>
                                    <Image
                                        src='/assets/mask.svg'
                                        width={32}
                                        height={20}
                                        alt='mask'
                                    />
                                </div>
                                <p className='font-poppins text-sm font-extralight text-white w-full'>Masks are obligatory for entrance</p>
                            </div>
                            <div className='flex gap-2 justify-evenly items-center w-full'>
                                <div className='w-1/6 flex items-center justify-center'>
                                    <Image
                                        src='/assets/nochildren.svg' 
                                        width={28}
                                        height={28}
                                        alt='nochildren'
                                    />
                                </div>
                                <p className='font-poppins text-sm font-extralight text-white w-full'>No children under 16 years of age allowed, even at the availability of ticket.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex-1'>
                    Hello
                </div>
            </section>
        </AnimatePresence>
    )
}
