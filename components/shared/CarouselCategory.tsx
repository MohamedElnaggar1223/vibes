import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel"
import ImageMotion from "./ImageMotion"
import Link from "next/link"

type Props = {
    title: string,
    subTitle: string,
    events: {
        title: string,
        imgUrl: string,
        price: string
    }[]
}

export default function CarouselCategory({ title, subTitle, events }: Props) 
{
    return (
        <section className='relative flex flex-col items-center h-[412px] justify-center gap-4 lg:flex-row'>
            <div className='flex flex-col gap-2 w-[12%] text-white lg:mb-auto mt-2'>
                <p className='font-poppins font-black text-2xl'>{title}</p>
                <div className='w-3/12 h-[2px] bg-white mb-4' />
                <p className='font-poppins font-medium text-xs'>{subTitle}</p>
            </div>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="h-full max-lg:w-full lg:flex-1"
            >
                <CarouselContent className=''>
                    {events.map((event, index) => (
                            <CarouselItem key={index} className={cn('group relative max-h-[412px] basis-1/3')}>
                                <ImageMotion
                                    selectedEvent={event}
                                    className='object-cover h-full w-full'
                                    index={index}
                                    width={412}
                                    height={412} 
                                    imageClassName="object-cover h-full w-full"
                                    priority={true}
                                />
                                <div className='absolute flex z-[9999] bg-gradient-to-t from-black from-30% via-black/75 to-slate-900/25 w-[calc(100%-1rem)] h-full opacity-0 text-lg group-hover:opacity-100 bottom-0 right-[0%] duration-300'>
                                    <div className='flex flex-col gap-4 text-white mt-auto w-full h-fit pr-6 pb-3'>
                                        <div className='flex flex-col justify-center items-start gap-2 h-full pl-2 border-l-[8px] border-[#E72377]'>
                                            <p className='font-poppins text-sm font-normal'>{event.title}</p>
                                            <p className='font-poppins text-xs font-light'>Al Manara Arena</p>
                                            <p className='font-poppins text-xs font-light'>June, 7th, 2024</p>
                                            <div className='w-full flex justify-between items-center'>
                                                <p className='font-poppins text-xs font-light'>Cairo, Egypt</p>
                                                <p className='font-poppins text-xs font-light'><span className='font-extralight mr-2'>starting from </span>{event.price}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col justify-center items-end'>
                                            <Link href={`/${index}`}>
                                                <button className='font-poppins text-[16px] bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-fit px-3 py-2 text-white'>
                                                    Book Now
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    )
}
