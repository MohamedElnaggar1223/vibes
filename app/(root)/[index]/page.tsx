import ImageMotion from "@/components/shared/ImageMotion"
import PurchaseTickets from "@/components/shared/PurchaseTickets"
import { events } from "@/constants"
import Image from "next/image"

type Props = {
    params: {
        index: string
    }
}

export default function EventPage({ params }: Props) 
{
    const selectedEvent = events[parseInt(params.index.toString())]

    return (
        <section className='flex flex-col w-full my-8 gap-4 lg:flex-row max-lg:items-center'>
            <div className='flex flex-col w-full max-w-[390px] rounded-xl bg-[rgba(217,217,217,0.2)] gap-1'>
                <ImageMotion 
                    selectedEvent={selectedEvent}
                    width={500}
                    height={500}
                    index={parseInt(params.index.toString())}
                    imageClassName="rounded-t-xl"
                    className="w-full object-contain h-full max-h-[212px] overflow-hidden"
                    priority={true}
                    layoutId={params.index.toString()}
                />
                <div className='flex flex-col p-3 gap-4'>
                    <p className='font-poppins text-2xl font-bold text-white'>{selectedEvent?.title}</p>
                    <div className='w-full flex justify-between items-center'>
                        <p className='font-poppins text-md font-extralight text-white'>Al Manara Arena</p>
                        <p className='font-poppins text-md font-extralight text-white mr-4'>Cairo, Egypt</p>
                    </div>
                    <p className='font-poppins text-md font-extralight text-white'>August, 1, 2024 | 8:30 PM GMT</p>
                    <p className='font-poppins text-md font-extralight text-white'>Gates open 4:30PM | Gates close 7:00 PM</p>
                    <div className='flex text-center w-full border-y-[1px] border-[#fff] py-4'>
                        <p className='font-poppins text-xs font-extralight text-white'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui offici.</p>
                    </div>
                    <div className='flex flex-col items-start justify-center w-full gap-6 my-4'>
                        <div className='flex gap-2 justify-evenly items-center w-full'>
                            <div className='w-1/6 flex items-center justify-center'>
                                <Image
                                    src='/assets/mask.svg'
                                    width={32}
                                    height={20}
                                    alt='mask'
                                />
                            </div>
                            <p className='font-poppins text-xs font-extralight text-white w-full'>Masks are obligatory for entrance</p>
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
                            <p className='font-poppins text-xs font-extralight text-white w-full'>No children under 16 years of age allowed, even at the availability of ticket.</p>
                        </div>
                    </div>
                </div>
            </div>
            <PurchaseTickets />
        </section>
    )
}
