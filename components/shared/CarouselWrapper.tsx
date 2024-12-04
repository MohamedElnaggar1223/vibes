'use client'
import { useRef } from 'react'
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel"
import DragHint from "./DragHint"
import { useCarouselScrollbar } from '@/hooks/useCarouselScrollbar'

type Props = {
    locale?: string | undefined
    title: string,
    subTitle: string,
    children: React.ReactNode
}

export default async function CarouselWrapper({ locale, title, subTitle, children }: Props) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const { scrollbarWidth, scrollbarLeft } = useCarouselScrollbar(carouselRef);

    return (
        <section dir={locale === 'ar' ? 'rtl' : 'ltr'} className='relative w-full flex items-center h-52 lg:h-[412px] justify-start gap-4 flex-row'>
            <DragHint isRTL={locale === 'ar'} />

            <div className="relative h-full max-lg:max-w-[100vw] lg:flex-1 lg:ml-12 max-lg:mt-16">
                <Carousel
                    ref={carouselRef}
                    opts={{
                        align: "start",
                        dragFree: true,
                        direction: locale === 'ar' ? 'rtl' : 'ltr'
                    }}
                    className="h-full"
                >
                    <CarouselContent className='pb-4'>
                        <CarouselItem className='max-h-48 max-w-48 lg:max-h-[412px] lg:max-w-[412px]'>
                            <div className='flex flex-col gap-2 text-white mb-auto mt-2'>
                                <p className='font-poppins font-black text-xl lg:text-3xl'>{title}</p>
                                <div className='w-2/3 lg:w-3/12 h-[2px] bg-white mb-4' />
                                <p className='w-full font-poppins font-medium text-xs'>{subTitle}</p>
                            </div>
                        </CarouselItem>
                        {children}
                    </CarouselContent>
                </Carousel>
                <div className="carousel-scrollbar">
                    <div
                        className="carousel-scrollbar-thumb"
                        style={{
                            width: `${scrollbarWidth}%`,
                            left: `${scrollbarLeft}%`
                        }}
                    ></div>
                </div>
            </div>
        </section>
    )
}