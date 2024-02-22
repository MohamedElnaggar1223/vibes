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
        <section className='flex flex-col'>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full mt-24 overflow-visible z-50"
                setApi={setApi}
            >
                <CarouselContent className=''>
                    <CarouselItem className={cn('max-h-[448px] basis-1/4', selectedIndex === 4 && 'max-h-[550px] h-[550px] basis-1/2 w-full z-10', selectedIndex === 0 && 'blur-sm mt-14', selectedIndex === 3 && 'blur-sm mt-14')} onClick={() => api?.scrollTo(4)}>
                        <Image
                            src="/assets/secondEvent.jfif"
                            width={728} 
                            height={448} 
                            alt="second event"
                            className="rounded-lg object-cover h-full w-full" 
                        />
                    </CarouselItem>
                    <CarouselItem className={cn('max-h-[448px] basis-1/4', selectedIndex === 0 && 'max-h-[550px] h-[550px] basis-1/2 w-full z-10', selectedIndex === 1 && 'blur-sm mt-14', selectedIndex === 4 && 'blur-sm mt-14' )} onClick={() => api?.scrollTo(0)}>
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
                    <CarouselItem className={cn('max-h-[448px] basis-1/4', selectedIndex === 3 && 'max-h-[550px] h-[550px] basis-1/2 w-full z-10', selectedIndex === 4 && 'blur-sm mt-14', selectedIndex === 2 && 'blur-sm mt-14' )} onClick={() => api?.scrollTo(3)}>
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
            <div className='flex flex-col gap-3 w-full pt-6 pb-4 pl-14 pr-4 bg-[rgba(217,217,217,0.2)] mb-4 mt-[-20px] z-10 text-white rounded-2xl w-fit'>
                <div className='flex justify-between items-center w-full'>
                    <p className='font-poppins font-medium text-2xl'>{selectedIndex === 0 ? 'Al Hilal VS Al Nassr' : 'Majid al-Muhandis'}</p>
                    <div className='flex flex-col gap-6 items-end'>
                        <p className='font-poppins text-base font-light'>starting from {selectedIndex === 0 ? '2,900 EGP' : '3,200 EGP'}</p>
                        <button className='font-poppins text-[16px] bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-fit px-3 py-2 text-white'>
                            Book Now
                        </button>
                    </div>
                </div>
                <div className='flex gap-6 items-center justify-center flex-1 min-h-full'>
                    <div className='flex flex-col gap-2 justify-between items-end text-nowrap min-h-full'>
                        <p className='font-poppins font-light text-lg'>Grand Cairo Stadium</p>
                        <p className='font-poppins font-light text-lg'>May,28th,2024</p>
                        <p className='font-poppins font-light text-lg'>Egypt,Cairo</p>
                    </div>
                    <div className='w-4 rotate-180 h-[172px] bg-[#7D40FF]' />
                    <p className='font-poppins font-light text-base w-fit'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
        </section>
    )
}