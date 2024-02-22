import ImageMotion from "@/components/shared/ImageMotion"
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
        <section className='flex flex-col w-full my-1 gap-4 lg:flex-row max-lg:items-center'>
            <div className='flex flex-col w-full max-w-[412px] rounded-xl bg-[rgba(217,217,217,0.2)] gap-1'>
                <ImageMotion 
                    selectedEvent={selectedEvent}
                    width={500}
                    height={500}
                    index={parseInt(params.index.toString())}
                    imageClassName="rounded-t-xl"
                    className="w-full object-contain h-full max-h-[212px] overflow-hidden"
                />
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
            <div className='flex-1 flex flex-col py-2 px-2 gap-6 max-lg:w-full'>
                <div className='w-full flex justify-between items-center gap-4'>
                    <div />
                    <button className='text-white font-poppins font-semibold text-base py-4 px-8 bg-[#232834] rounded-lg'>
                        Choose Your Tickets
                    </button>
                    <button className='text-white font-poppins font-semibold text-base py-4 px-8 bg-[#232834] rounded-lg'>
                        Map
                    </button>
                </div>
                <div className='flex-1 w-full flex items-center justify-center'>
                    <div className='py-6 px-14 bg-[rgba(255,255,255,0.15)] text-white font-poppins font-semibold text-base rounded-lg'>
                        {"Choose Your Tickets & They’ll Appear Here"}
                    </div>
                </div>
                <div className='w-full flex justify-between items-center py-2 px-8 bg-[#181C25] rounded-lg'>
                    <div className='flex flex-col items-center justify-between gap-2'>
                        <p className='font-poppins text-base text-white'>Number of tickets</p>
                        <p className='font-poppins text-lg text-white font-semibold'>0</p>
                    </div>
                    <div className='flex flex-col items-center justify-between gap-2'>
                        <p className='font-poppins text-base text-white'>Total</p>
                        <p className='font-poppins text-lg text-white font-semibold'>0 EGP</p>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <button className='font-poppins text-lg w-fit font-normal px-5 rounded-lg py-1.5 text-white bg-[#D9D9D9]'>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
