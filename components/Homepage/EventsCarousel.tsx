'use client'
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "../ui/carousel";
import { memo, useEffect, useMemo, useState } from "react";
import { cn, convertArgbToHex, getDaySuffix, toArabicDate } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import ImageMotion from "../shared/ImageMotion";
import { AnimatePresence } from "framer-motion";
import Autoplay from 'embla-carousel-autoplay'
import { Category, EventType, ExchangeRate } from "@/lib/types/eventTypes";
import { months } from "@/constants";
import FormattedPrice from "../shared/FormattedPrice";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

type Props = {
    events: EventType[],
    exchangeRate: ExchangeRate
    locale: string | undefined
    categories: Category[]
}

function EventsCarousel({ events, exchangeRate, locale, categories }: Props) 
{
    const { t } = useTranslation()

    const pathname = usePathname()
    
    const [api, setApi] = useState<CarouselApi>()
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [currentWidth, setCurrentWidth] = useState<number>()

    const router = useRouter()

    useEffect(() => {
        if(window) setCurrentWidth(window?.innerWidth!)
    }, [])

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

    useEffect(() => {
        const handleResize = () => setCurrentWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <AnimatePresence>
            <section className='w-full flex flex-col overflow-x-hidden max-lg:mt-5'>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className={"min-w-full mt-24 overflow-visible z-50"}
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
                            // <CarouselItem 
                            //     key={index} 
                            //     className={cn('max-h-[448px] basis-1/4', (index === 0 ? selectedIndex === events.length - 1 : selectedIndex === index - 1) ? 'max-h-[550px] h-[550px] basis-1/2 w-full z-10 cursor-pointer' : 'blur-sm mt-14', events.length < 2 && 'basis-auto', events.length === 2 && 'basis-1/2', events.length === 3 || events.length === 4 && 'basis-1/3 max-w-[400px]', events.length === 1 && 'mx-auto basis-auto', (events.length === 3 || events.length === 4) && (index === 0 ? selectedIndex === events.length - 1 : selectedIndex === index - 1) && 'min-w-[800px]' )} 
                            //     onClick={() => {
                            //         if(index === 0 && events.length - 1 === selectedIndex) router.push(`/events/${event.id}`)
                            //         else if(index - 1 === selectedIndex) router.push(`/events/${event.id}`)
                            //         api?.scrollTo(index === 0 ? events.length - 1 : index - 1)
                            //         setTimeout(() => {
                            //             setSelectedIndex(index === 0 ? events.length - 1 : index - 1)
                            //         }, 500)
                            //     }}
                            // >
                            <CarouselItem 
                                key={index} 
                                className={cn('max-h-[448px] overflow-visible', events.length === 1 ? 'min-w-[728px] min-h-[448px] mx-auto' : events.length === 2 ? 'flex-1 basis-1/2 mx-auto' : 'basis-1/3', (index === 0 ? selectedIndex === events.length - 1 : selectedIndex === index - 1) ? 'z-[9999] cursor-pointer' : 'blur-sm mt-14')}
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
                                    imageClassName={(index === 0 ? selectedIndex === events.length - 1 : selectedIndex === index - 1) ? 'absolute rounded-lg max-w-[calc(50vw-5rem)] min-h-[125%] max-lg:min-h-[220px] max-lg:min-w-[280px] max-h-[125%] z-[99999999]' : "max-lg:absolute max-lg:min-w-[180px] max-lg:min-h-[150px] rounded-lg object-cover h-full w-full max-w-[872px]"}
                                    priority={true}
                                    layoutId={event.id}
                                    eventPage={false}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className='flex flex-col gap-3 w-full pt-6 pb-4 pl-4 lg:pl-14 pr-4 bg-[rgba(217,217,217,0.2)] mb-4 mt-[4.65rem] lg:mt-4 z-10 text-white rounded-2xl max-lg:h-[34rem] lg:h-80'>
                    {(currentWidth ?? 0) > 1024 ? (
                        <>
                            <div dir={pathname?.includes('/ar') ? 'rtl' : 'ltr'} className='flex flex-col lg:flex-row justify-between items-center w-full gap-4'>
                                <p className='font-poppins font-medium text-2xl text-center max-lg:w-full'>{selectedIndex === events.length - 1 ? locale === 'ar' ? events[0].nameArabic : events[0].name : locale === 'ar' ? events[selectedIndex + 1].nameArabic : events[selectedIndex + 1].name }</p>
                                <div className='flex flex-col gap-2 lg:gap-6 items-end max-lg:w-full'>
                                    <p className='font-poppins text-base font-extralight'>{t('startingFrom')} {selectedIndex === events.length - 1 ? <FormattedPrice price={events[0].tickets[0].price} exchangeRate={exchangeRate} /> : <FormattedPrice price={events[selectedIndex + 1].tickets[0].price} exchangeRate={exchangeRate} />}</p>
                                    <button onClick={() => router.push(`/events/${selectedIndex === events.length - 1 ? events[0].id : events[selectedIndex + 1].id}`)} className='font-poppins text-[16px] bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-fit px-3 py-2 text-white'>
                                        {t('common:book')}
                                    </button>
                                </div>
                            </div>
                            <div dir={pathname?.includes('/ar') ? 'rtl' : 'ltr'} className='flex flex-col lg:flex-row lg:gap-6 items-center justify-center flex-1 w-full'>
                                <div className='flex flex-col gap-2 justify-between items-end text-nowrap h-36 max-lg:w-full'>
                                    <p className='font-poppins font-extralight text-lg max-lg:text-left max-lg:w-full text-nowrap'>{selectedIndex === events.length - 1 ? locale === 'ar' ? events[0].venueArabic : events[0].venue : locale === 'ar' ? events[selectedIndex + 1].venueArabic : events[selectedIndex + 1].venue}</p>
                                    <p className='font-poppins font-extralight text-lg max-lg:text-left max-lg:w-full text-nowrap'>{selectedIndex === events.length - 1 ? locale === 'ar' ? toArabicDate(`${months[events[0].eventDate?.getMonth()]}, ${getDaySuffix(events[0].eventDate.getDate())}, ${events[0].eventDate.getFullYear()}`) : `${months[events[0].eventDate?.getMonth()]}, ${getDaySuffix(events[0].eventDate.getDate())}, ${events[0].eventDate.getFullYear()}` : locale === 'ar' ? toArabicDate(`${months[events[selectedIndex + 1].eventDate?.getMonth()]}, ${getDaySuffix(events[selectedIndex + 1].eventDate.getDate())}, ${events[selectedIndex + 1].eventDate.getFullYear()}`) : `${months[events[selectedIndex + 1].eventDate?.getMonth()]}, ${getDaySuffix(events[selectedIndex + 1].eventDate.getDate())}, ${events[selectedIndex + 1].eventDate.getFullYear()}`}</p>
                                    <p className='font-poppins font-extralight text-lg max-lg:text-left max-lg:w-full text-nowrap'>{selectedIndex === events.length - 1 ? t(`${events[0].country.replaceAll(" ", '')}`) : t(`${events[selectedIndex + 1].country.replaceAll(" ", '')}`)},{selectedIndex === events.length - 1 ? locale === 'ar' ? events[0].cityArabic : events[0].city : locale === 'ar' ? events[selectedIndex + 1].cityArabic : events[selectedIndex + 1].city}</p>
                                </div>
                                <div className='w-4 rotate-0 lg:rotate-180 max-lg:h-[10px] max-lg:my-4 max-lg:w-[90%] h-[172px]' style={{ background: selectedIndex === events.length - 1 ? convertArgbToHex(categories.find(cat => cat.id === events[0].categoryID)?.color!)! : convertArgbToHex(categories.find(cat => cat.id === events[selectedIndex + 1].categoryID)?.color!)! }} />
                                <p className='font-poppins font-extralight text-base w-fit flex-1'>{selectedIndex === events.length - 1 ? locale === 'ar' ? events[0].descriptionArabic.length > 780 ? `${events[0].descriptionArabic.slice(0, 780)}...` : events[0].descriptionArabic : events[0].description.length > 780 ? `${events[0].description.slice(0,780)}...` : events[0].description : locale === 'ar' ? events[selectedIndex + 1].descriptionArabic.length > 780 ? `${events[selectedIndex + 1].descriptionArabic.slice(0, 780)}...` : events[selectedIndex + 1].descriptionArabic : events[selectedIndex + 1].description.length > 780 ? `${events[selectedIndex + 1].description.slice(0, 780)}...` : events[selectedIndex + 1].description}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className='font-poppins font-medium text-lg lg:text-2xl text-center max-lg:w-full'>{selectedIndex === events.length - 1 ? locale === 'ar' ? events[0].nameArabic : events[0].name : locale === 'ar' ? events[selectedIndex + 1].nameArabic : events[selectedIndex + 1].name}</p>
                            <div className='flex gap-4 items-center justify-between flex-1 w-full my-6 mb-auto max-h-32 '>
                                <div className='flex gap-2 flex-1'>
                                    <div className='min-w-2.5 rotate-180 min-h-full' style={{ background: selectedIndex === events.length - 1 ? convertArgbToHex(categories.find(cat => cat.id === events[0].categoryID)?.color!)! : convertArgbToHex(categories.find(cat => cat.id === events[selectedIndex + 1].categoryID)?.color!)! }} />
                                    <div className='flex flex-col gap-2 justify-between items-end text-nowrap h-24 flex-1'>
                                        <p className='font-poppins font-extralight text-sm text-left w-full text-nowrap'>{selectedIndex === events.length - 1 ? locale === 'ar' ? events[0].venueArabic : events[0].venue : locale === 'ar' ? events[selectedIndex + 1].venueArabic : events[selectedIndex + 1].venue}</p>
                                        <p className='font-poppins font-extralight text-sm text-left w-full text-nowrap'>{selectedIndex === events.length - 1 ? locale === 'ar' ? toArabicDate(`${months[events[0].eventDate?.getMonth()]}, ${getDaySuffix(events[0].eventDate.getDate())}, ${events[0].eventDate.getFullYear()}`) : `${months[events[0].eventDate?.getMonth()]}, ${getDaySuffix(events[0].eventDate.getDate())}, ${events[0].eventDate.getFullYear()}` : locale === 'ar' ? toArabicDate(`${months[events[selectedIndex + 1].eventDate?.getMonth()]}, ${getDaySuffix(events[selectedIndex + 1].eventDate.getDate())}, ${events[selectedIndex + 1].eventDate.getFullYear()}`) : `${months[events[selectedIndex + 1].eventDate?.getMonth()]}, ${getDaySuffix(events[selectedIndex + 1].eventDate.getDate())}, ${events[selectedIndex + 1].eventDate.getFullYear()}`}</p>
                                        <p className='font-poppins font-extralight text-sm text-left w-full text-nowrap'>{selectedIndex === events.length - 1 ? t(`${events[0].country.replaceAll(" ", '')}`) : t(`${events[selectedIndex + 1].country.replaceAll(" ", '')}`)},{selectedIndex === events.length - 1 ? locale === 'ar' ? events[0].cityArabic : events[0].city : locale === 'ar' ? events[selectedIndex + 1].cityArabic : events[selectedIndex + 1].city}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2 lg:gap-6 items-end justify-end h-full'>
                                    <p className='font-poppins text-sm lg:text-base font-extralight flex flex-col'><span>starting from</span> <span className='font-medium text-right'>{selectedIndex === events.length - 1 ? <FormattedPrice price={events[0].tickets[0].price} exchangeRate={exchangeRate} /> : <FormattedPrice price={events[selectedIndex + 1].tickets[0].price} exchangeRate={exchangeRate} />}</span></p>
                                    <button onClick={() => router.push(`/events/${selectedIndex === events.length - 1 ? events[0].id : events[selectedIndex + 1].id}`)} className='font-poppins text-sm lg:text-[16px] bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-fit px-3 py-2 text-white'>
                                        {t('common:book')}
                                    </button>
                                </div>
                            </div>
                            <p className='font-poppins font-extralight text-sm lg:text-base w-fit flex-1'>{selectedIndex === events.length - 1 ? locale === 'ar' ? events[0].descriptionArabic.length > 780 ? `${events[0].descriptionArabic.slice(0, 780)}...` : events[0].descriptionArabic : events[0].description.length > 780 ? `${events[0].description.slice(0,780)}...` : events[0].description : locale === 'ar' ? events[selectedIndex + 1].descriptionArabic.length > 780 ? `${events[selectedIndex + 1].descriptionArabic.slice(0, 780)}...` : events[selectedIndex + 1].descriptionArabic : events[selectedIndex + 1].description.length > 780 ? `${events[selectedIndex + 1].description.slice(0, 780)}...` : events[selectedIndex + 1].description}</p>
                        </>
                    )
                    }
                </div>
            </section>
        </AnimatePresence>
    )
}

const memoizedEventsCarousel = memo(EventsCarousel)
export default memoizedEventsCarousel