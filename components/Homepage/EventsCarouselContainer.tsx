import { Suspense } from "react";
import EventsCarousel from "./EventsCarousel";

export default function EventsCarouselContainer() 
{
    return (
        <Suspense>
            <EventsCarousel />
        </Suspense>
    )
}
