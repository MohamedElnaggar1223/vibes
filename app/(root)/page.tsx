import EventsCarouselContainer from "@/components/Homepage/EventsCarouselContainer";
import CarouselCategory from "@/components/shared/CarouselCategory";
import Search from "@/components/shared/Search";
import { events } from "@/constants";
import { initAdmin } from "@/firebase/server/config";
import { Display } from "@/lib/types/eventTypes";

export default async function Home() 
{
	const admin = await initAdmin()
	const displaysData = (await admin.firestore().collection('displays').get())?.docs.map(doc => ({...doc.data(), id: doc.id, createdAt: doc.data().createdAt.toDate()})) as Display[]

	const displays = displaysData.sort((a, b) => {
        if(a.createdAt && b.createdAt) return a.createdAt.getTime() - b.createdAt.getTime()
        else if(a.createdAt) return -1
        else if(b.createdAt) return 1
        else return 0
    })

	return (
		<section className='flex flex-col items-center justify-center w-full overflow-x-hidden'>
			{/* <Search /> */}
			<EventsCarouselContainer events={displays.find(display => display.display === 'Top Events')?.events} />
			<section className='flex flex-col max-lg:gap-24 gap-4 my-36 w-full'>
				{displays.slice().filter(display => display.events.length > 0 && display.display !== 'Top Events').map(display => (
					<CarouselCategory key={display.id} title={display.display} subTitle={display.description} events={display.events} />
				))}
				{/* <CarouselCategory title='Hottest Events' subTitle="Those are the hottest events of 2024!" events={events.slice(5, 8)} />
				<CarouselCategory title='Vibes Exclusive' subTitle="These are some of the events you’ve missed! Don’t worry we have more coming!" events={events.slice(8)} /> */}
			</section>
		</section>
	);
}
