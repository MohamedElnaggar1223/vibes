import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel"
import ImageMotion from "./ImageMotion"

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
        <section className='flex flex-col items-center h-[412px] justify-center gap-4 lg:flex-row'>
            <div className='flex flex-col gap-2 w-[12%] text-white lg:mb-auto mt-2'>
                <p className='font-poppins font-black text-2xl'>{title}</p>
                <div className='w-3/12 h-[2px] bg-white mb-4' />
                <p className='font-poppins font-medium text-xs'>{subTitle}</p>
            </div>
            <Carousel
                opts={{
                    align: "start",
                }}
                className="h-full max-lg:w-full lg:flex-1"
            >
                <CarouselContent className=''>
                    {events.map((event, index) => (
                            <CarouselItem key={index} className={cn('max-h-[412px] basis-1/3')}>
                                <ImageMotion
                                    selectedEvent={event}
                                    className='rounded-lg object-cover h-full w-full'
                                    index={index}
                                    width={412}
                                    height={412} 
                                    imageClassName="rounded-lg object-cover h-full w-full"
                                    priority={true}
                                />
                            </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    )
}
