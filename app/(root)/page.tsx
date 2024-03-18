import EventsCarouselContainer from "@/components/Homepage/EventsCarouselContainer";
import Search from "@/components/Homepage/Search/Search";
import SearchLoading from "@/components/Homepage/Search/SearchLoading";
import CarouselCategory from "@/components/shared/CarouselCategory";
import SearchBar from "@/components/shared/SearchBar";
import { initAdmin } from "@/firebase/server/config";
import { Display } from "@/lib/types/eventTypes";
import { Suspense } from "react";

type Props = {
	searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Home({ searchParams }: Props) 
{
	const admin = await initAdmin()
	const displaysData = (await admin.firestore().collection('displays').get())?.docs.map(doc => ({...doc.data(), id: doc.id, createdAt: doc.data().createdAt.toDate()})) as Display[]

	const displays = displaysData.sort((a, b) => {
        if(a.createdAt && b.createdAt) return a.createdAt.getTime() - b.createdAt.getTime()
        else if(a.createdAt) return -1
        else if(b.createdAt) return 1
        else return 0
    })

	const search = searchParams.search
	
	return (
		<section className='flex flex-col items-center justify-center w-full overflow-x-hidden' key={Math.random()}>
			<SearchBar />
			{
				search ? (
					<Suspense fallback={<SearchLoading />}>
						<Search search={search as string} />
					</Suspense>
				) : (
					<>
						<EventsCarouselContainer events={displays.find(display => display.display === 'Top Events')?.events} />
						<section className='flex flex-col max-lg:gap-24 gap-4 my-36 w-full'>
							{displays.slice().filter(display => display.events.length > 0 && display.display !== 'Top Events').map(display => (
								<CarouselCategory key={display.id} title={display.display} subTitle={display.description} events={display.events} />
							))}
						</section>
					</>
				)
			}
		</section>
	);
}
