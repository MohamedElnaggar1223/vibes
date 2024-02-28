'use client'
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "../ui/carousel";
import { memo, useEffect, useMemo, useState } from "react";
import { cn, getDaySuffix } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ImageMotion from "../shared/ImageMotion";
import { AnimatePresence } from "framer-motion";
import Autoplay from 'embla-carousel-autoplay'
import { EventType, ExchangeRate } from "@/lib/types/eventTypes";
import { months } from "@/constants";
import FormattedPrice from "../shared/FormattedPrice";

type Props = {
    events: EventType[],
    exchangeRate: ExchangeRate
}

function EventsCarousel({ events, exchangeRate }: Props) 
{
    const [api, setApi] = useState<CarouselApi>()
    const [selectedIndex, setSelectedIndex] = useState(0)

    const router = useRouter()

    useEffect(() => {
        if (!api) {
          return
        }

        api.on("select", () => {
            setTimeout(() => {
                if(selectedIndex !== events.length - 1) setSelectedIndex(api.selectedScrollSnap())
            }, 500);
        })
      }, [api])

    return (
        <AnimatePresence>
            <section className='w-full flex flex-col'>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="min-w-full mt-24 overflow-visible z-50"
                    plugins={[
                        Autoplay({
                            delay: 3000,
                            playOnInit: true,
                            stopOnInteraction: true,
                        })
                    ]}
                    setApi={setApi}
                >
                    <CarouselContent className=''>
                        {events.map((event, index) => (
                            <CarouselItem 
                                key={index} 
                                className={cn('max-h-[448px] basis-1/4', (index === 0 ? selectedIndex === events.length - 1 : selectedIndex === index - 1) ? 'max-h-[550px] h-[550px] basis-1/2 w-full z-10' : 'blur-sm mt-14', events.length < 2 && 'basis-auto', events.length === 2 && 'basis-1/2', events.length === 3 || events.length === 4 && 'basis-1/3 w-full', events.length === 1 && 'mx-auto basis-auto')} 
                                onClick={() => {
                                    if(index === 0 && events.length - 1 === selectedIndex) router.push(`/events/${event.id}`)
                                    else if(index - 1 === selectedIndex) router.push(`/events/${event.id}`)
                                    api?.scrollTo(index === 0 ? events.length - 1 : index - 1)
                                    setTimeout(() => {
                                        setSelectedIndex(index === 0 ? events.length - 1 : index - 1)
                                    }, 500)
                                }}
                            >
                                <ImageMotion
                                    selectedEvent={event}
                                    className='rounded-lg object-cover h-full w-full flex items-center justify-center'
                                    width={728}
                                    height={448} 
                                    imageClassName="rounded-lg object-cover h-full w-full max-w-[872px]"
                                    priority={true}
                                    layoutId={event.id}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className='flex flex-col gap-3 w-full pt-6 pb-4 pl-14 pr-4 bg-[rgba(217,217,217,0.2)] mb-4 mt-[-20px] z-10 text-white rounded-2xl'>
                    <div className='flex justify-between items-center w-full'>
                        <p className='font-poppins font-medium text-2xl'>{selectedIndex === events.length - 1 ? events[0].name : events[selectedIndex + 1].name}</p>
                        <div className='flex flex-col gap-6 items-end'>
                            <p className='font-poppins text-base font-extralight'>starting from {selectedIndex === events.length - 1 ? <FormattedPrice price={events[0].tickets[0].price} exchangeRate={exchangeRate} /> : <FormattedPrice price={events[selectedIndex + 1].tickets[0].price} exchangeRate={exchangeRate} />}</p>
                            <button onClick={() => router.push(`/events/${selectedIndex === events.length - 1 ? events[0].id : events[selectedIndex + 1].id}`)} className='font-poppins text-[16px] bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-fit px-3 py-2 text-white'>
                                Book Now
                            </button>
                        </div>
                    </div>
                    <div className='flex gap-6 items-center justify-center flex-1 w-full'>
                        <div className='flex flex-col gap-2 justify-between items-end text-nowrap h-36'>
                            <p className='font-poppins font-extralight text-lg'>{selectedIndex === events.length - 1 ? events[0].venue : events[selectedIndex + 1].venue}</p>
                            <p className='font-poppins font-extralight text-lg'>{selectedIndex === events.length - 1 ? `${months[events[0].eventDate?.getMonth()]}, ${getDaySuffix(events[0].eventDate.getDate())}, ${events[0].eventDate.getFullYear()}` : `${months[events[selectedIndex + 1].eventDate?.getMonth()]}, ${getDaySuffix(events[selectedIndex + 1].eventDate.getDate())}, ${events[selectedIndex + 1].eventDate.getFullYear()}`}</p>
                            <p className='font-poppins font-extralight text-lg'>{selectedIndex === events.length - 1 ? events[0].country : events[selectedIndex + 1].country},{selectedIndex === events.length - 1 ? events[0].city : events[selectedIndex + 1].city}</p>
                        </div>
                        <div className='w-4 rotate-180 h-[172px] bg-[#7D40FF]' />
                        <p className='font-poppins font-extralight text-base w-fit flex-1'>{selectedIndex === events.length - 1 ? events[0].description : events[selectedIndex + 1].description}</p>
                    </div>
                </div>
            </section>
        </AnimatePresence>
    )
}

const memoizedEventsCarousel = memo(EventsCarousel)
export default memoizedEventsCarousel