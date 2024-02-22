'use client'
import Image from "next/image";
import { Carousel, CarouselContent, CarouselPrevious, CarouselNext, CarouselItem, CarouselApi } from "../ui/carousel";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function EventsCarousel() 
{
    const [api, setApi] = useState<CarouselApi>()
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        if (!api) {
          return
        }

        api.on("select", () => {
            setTimeout(() => {
                setSelectedIndex(api.selectedScrollSnap())
            }, 500)
        })
      }, [api])

    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full mt-24 overflow-visible"
            setApi={setApi}
        >
            <CarouselContent className=''>
                <CarouselItem className={cn('max-h-[448px] basis-1/4', selectedIndex === 3 && 'max-h-[550px] h-[550px] basis-1/2 w-full z-10', selectedIndex === 0 && 'blur-sm mt-14', selectedIndex === 2 && 'blur-sm mt-14')} onClick={() => api?.scrollTo(3)}>
                    <Image
                        src="/assets/secondEvent.jfif"
                        width={728} 
                        height={448} 
                        alt="second event"
                        className="rounded-lg object-cover h-full w-full" 
                    />
                </CarouselItem>
                <CarouselItem className={cn('max-h-[448px] basis-1/4', selectedIndex === 0 && 'max-h-[550px] h-[550px] basis-1/2 w-full z-10', selectedIndex === 1 && 'blur-sm mt-14', selectedIndex === 3 && 'blur-sm mt-14' )} onClick={() => api?.scrollTo(0)}>
                    <Image
                        src="/assets/firstevent.jfif"
                        width={728} 
                        height={448} 
                        alt="first event"
                        className="rounded-lg object-cover h-full w-full" 
                    />
                </CarouselItem>
                <CarouselItem className={cn('max-h-[448px] basis-1/4', selectedIndex === 1 && 'max-h-[550px] h-[550px] basis-1/2 w-full z-10', selectedIndex === 2 && 'blur-sm mt-14', selectedIndex === 0 && 'blur-sm mt-14' )} onClick={() => api?.scrollTo(1)}>
                    <Image
                        src="/assets/thirdEvent.png"
                        width={728} 
                        height={448} 
                        alt="third event"
                        className="rounded-lg object-cover h-full w-full" 
                    />
                </CarouselItem>
                <CarouselItem className={cn('max-h-[448px] basis-1/4', selectedIndex === 2 && 'max-h-[550px] h-[550px] basis-1/2 w-full z-10', selectedIndex === 3 && 'blur-sm mt-14', selectedIndex === 1 && 'blur-sm mt-14' )} onClick={() => api?.scrollTo(2)}>
                    <Image
                        src="/assets/fourthEvent.jfif"
                        width={728} 
                        height={448} 
                        alt="fourth event"
                        className="rounded-lg object-cover h-full w-full" 
                    />
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    )
}