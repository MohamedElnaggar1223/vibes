import { cn, getDigitalProducts, getMyDigitalProducts, initTranslations } from "@/lib/utils"
import { Suspense } from "react"
import EventsLoading from "../categories/eventsLoading"
import SearchDigitalProducts from "./search-digital-products"
import DigitalProduct from "./digital-products"
import { Accordion } from "@/components/ui/accordion"
import { getUser } from "../layout"
import Link from "next/link"
import ResellMarketHeaders from "../resell-market/resell-market-headers"
import ResellMarketFilters from "@/components/shared/ResellMarketFilters"
import DigitalProductsFilters from "@/components/shared/DigitalProductsFilters"

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
    params: {
        locale?: string | undefined
    }
}

const countries = {
    'KSA': 'Saudi Arabia',
    'UAE': 'United Arab Emirates',
    'Egypt': 'Egypt'
}

export default async function DigitalProducts({ searchParams, params }: Props) 
{
    const tab = typeof searchParams.tab === 'string' ? searchParams.tab : undefined

    const { t } = await initTranslations(params.locale!, ['homepage', 'common', 'auth'])

    const user = await getUser()

    const digitalProducts = await getDigitalProducts()
    const myDigitalProducts = user ? await getMyDigitalProducts(user?.id!) : []

    const category = typeof searchParams.category === 'string' ? searchParams.category : undefined

    return (
        <section dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='flex flex-col relative flex-1 items-center justify-start p-4 md:p-12 gap-8 md:max-h-screen'>
            <ResellMarketHeaders locale={params.locale} />
            <section dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='relative flex max-lg:flex-col flex-1 w-full gap-6 items-start lg:items-start justify-start mb-16 overflow-auto' key={Math.random()}>
                <div className='flex lg:flex-col mt-2 lg:mt-16 gap-1 w-full lg:w-48 sticky top-0'>
                    <p className='font-poppins text-white font-light max-lg:hidden'>{t('filters')}</p>
                    <DigitalProductsFilters locale={params.locale} />
                </div>
                <div className="flex flex-col flex-1 gap-6 items-start justify-start mx-auto">
                    {
                        (tab === 'my-products' && user) ? 
                        (myDigitalProducts
                        .filter(hotel => category ? hotel.itemCategory.toLocaleLowerCase().includes(category.toLocaleLowerCase()) : true)
                        .length === 0 ? (
                            <p className='flex items-center justify-center text-white w-full text-lg text-center font-poppins font-semibold h-52 flex-1 max-lg:w-full'>{t('noHotels')}</p>
                        ) : (
                            <Suspense fallback={<EventsLoading />}>
                                <div className='flex flex-col flex-1 gap-8 w-full items-center mt-8'>
                                    <Accordion type='multiple' className="!border-none !divide-none w-full">
                                        {myDigitalProducts
                                            .filter(digitalProduct => category ? digitalProduct.itemCategory.toLocaleLowerCase().includes(category.toLocaleLowerCase()) : true)
                                            .map(digitalProduct => (
                                            <DigitalProduct buy={false} user={user!} locale={params.locale} key={digitalProduct.id} digitalProduct={digitalProduct} /> 
                                        ))}
                                    </Accordion>
                                </div>
                            </Suspense>
                        )) : 
                        digitalProducts
                        .filter(hotel => category ? hotel.itemCategory.toLocaleLowerCase().includes(category.toLocaleLowerCase()) : true)
                        .length === 0 ? (
                            <p className='flex items-center justify-center text-white w-full text-lg text-center font-poppins font-semibold h-52 flex-1 max-lg:w-full'>{t('noHotels')}</p>
                        ) : (
                            <Suspense fallback={<EventsLoading />}>
                                <div className='flex flex-col flex-1 gap-8 w-full items-center mt-8'>
                                    <Accordion type='multiple' className="!border-none !divide-none w-full">
                                        {digitalProducts
                                            .filter(digitalProduct => category ? digitalProduct.itemCategory.toLocaleLowerCase().includes(category.toLocaleLowerCase()) : true)
                                            .map(digitalProduct => (
                                            <DigitalProduct buy={true} user={user!} locale={params.locale} key={digitalProduct.id} digitalProduct={digitalProduct} /> 
                                        ))}
                                    </Accordion>
                                </div>
                            </Suspense>
                        )
                    }
                </div>
            </section>
        </section>
    )
}