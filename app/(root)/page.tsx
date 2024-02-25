import EventsCarouselContainer from "@/components/Homepage/EventsCarouselContainer";
import CarouselCategory from "@/components/shared/CarouselCategory";
import Search from "@/components/shared/Search";
import { events } from "@/constants";
import { getServerSession } from "next-auth";

export default async function Home() 
{
	return (
		<section className='flex flex-col items-center justify-center w-full'>
			<Search />
			<EventsCarouselContainer />
			<section className='flex flex-col gap-4 my-36'>
				<CarouselCategory title='Hottest Events' subTitle="Those are the hottest events of 2024!" events={events.slice(5, 8)} />
				<CarouselCategory title='Vibes Exclusive' subTitle="These are some of the events you’ve missed! Don’t worry we have more coming!" events={events.slice(8)} />
			</section>
		</section>
	);
}
