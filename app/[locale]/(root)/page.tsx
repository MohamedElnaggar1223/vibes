import EventsCarouselContainer from "@/components/Homepage/EventsCarouselContainer";
import Search from "@/components/Homepage/Search/Search";
import SearchLoading from "@/components/Homepage/Search/SearchLoading";
import CarouselCategory from "@/components/shared/CarouselCategory";
import SearchBar from "@/components/shared/SearchBar";
import { initAdmin } from "@/firebase/server/config";
import { Display } from "@/lib/types/eventTypes";
import { getCategories, getExchangeRate } from "@/lib/utils";
import { Suspense } from "react";

type Props = {
	params: {
		locale?: string
	}
	searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Home({ searchParams, params }: Props) {
	const admin = await initAdmin()
	const displaysData = (await admin.firestore().collection('displays').get())?.docs.map(doc => ({ ...doc.data(), id: doc.id, createdAt: doc.data().createdAt.toDate() })) as Display[]
	const categories = await getCategories()
	const exchangeRate = await getExchangeRate()
	
	const displays = displaysData.sort((a, b) => {
		if (a.createdAt && b.createdAt) return a.createdAt?.getTime() - b.createdAt?.getTime()
		else if (a.createdAt) return -1
		else if (b.createdAt) return 1
		else return 0
	})

	const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
	const date = typeof searchParams.date === 'string' ? searchParams.date : undefined
	const country = typeof searchParams.country === 'string' && (searchParams.country === 'UAE' || searchParams.country === 'Egypt' || searchParams.country === 'KSA') ? searchParams.country : undefined
	const category = typeof searchParams.category === 'string' ? searchParams.category : undefined

	return (
		<section className='flex flex-col items-center justify-center w-full overflow-x-hidden' key={Math.random()}>
			<SearchBar locale={params.locale} />
			{
				(search || date || country || category) ? (
					<Suspense fallback={<SearchLoading />}>
						<Search locale={params.locale} search={search} date={date} category={category} country={country} categories={categories} exchangeRate={exchangeRate} />
					</Suspense>
				) : (
					<>
						<EventsCarouselContainer categories={categories} locale={params.locale} events={displays.find(display => display.display === 'Top Events')?.events} />
						<section className='flex flex-col max-lg:gap-24 gap-4 my-8 lg:my-36 w-full'>
							{displays.slice().filter(display => display.events.length > 0 && display.display !== 'Top Events').map(display => (
								<CarouselCategory locale={params.locale} key={display.id} title={params.locale === 'ar' ? display.displayArabic : display.display} subTitle={params.locale === 'ar' ? display.descriptionArabic : display.description} events={display.events} />
							))}
						</section>
					</>
				)
			}
		</section>
	)
}
