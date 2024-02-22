import EventsCarouselContainer from "@/components/Homepage/EventsCarouselContainer";
import CarouselCategory from "@/components/shared/CarouselCategory";
import Search from "@/components/shared/Search";
import { events } from "@/constants";

export default async function Home() 
{
	return (
		<section className='flex flex-col items-center justify-center w-full'>
			<Search />
			<EventsCarouselContainer />
			<section className='flex flex-col gap-4 mt-36'>
				<CarouselCategory title='Hottest Events' subTitle="Those are the hottest events of 2024!" events={events} />
				<CarouselCategory title='Vibes Exclusive' subTitle="These are some of the events you’ve missed! Don’t worry we have more coming!" events={events} />
			</section>
		</section>
	);
}
