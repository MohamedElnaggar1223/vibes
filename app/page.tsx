import EventsCarouselContainer from "@/components/Homepage/EventsCarouselContainer";
import Search from "@/components/shared/Search";

export default function Home() 
{
	return (
		<section className='flex flex-col items-center justify-center w-full'>
			<Search />
			<EventsCarouselContainer />
		</section>
	);
}
