import { Suspense } from "react"
import { Accordion } from "../ui/accordion"
import DigitalProduct from "@/app/[locale]/(root)/digital-products/digital-products"
import useSWR from "swr"
import { useTranslation } from "react-i18next"
import { UserType } from "@/lib/types/userTypes"
import { db } from "@/firebase/client/config"
import { collection, query, where, getDocs } from "firebase/firestore"
import { DigitalProduct as DigitalProductType } from "@/lib/types/digitalProductTypes"

export default async function MyDigitalProducts({ params, user }: { params: { locale?: string | undefined }, user: UserType })
{
    const { t } = useTranslation()

    const { data: myDigitalProducts } = useSWR('digitalProducts', async (...args) => {
        if(!user) return []

        const digitalProductsCollection = collection(db, 'digitalProducts')
        
        const queryDigitalProducts = query(digitalProductsCollection, where('buyerId', '==', user.id))

        const digitalProductsSnapshot = await getDocs(queryDigitalProducts)

        const digitalProducts = digitalProductsSnapshot.docs.map(doc => ({...doc.data(), id: doc.id })) as unknown as DigitalProductType[]

        return digitalProducts
    })

    return (
            (myDigitalProducts
            ?.length === 0 ? (
                <p className='flex items-center justify-center text-white w-full text-lg text-center font-poppins font-semibold h-52 flex-1 max-lg:w-full'>{t('noHotels')}</p>
            ) : (
                <Suspense fallback={<></>}>
                    <div className='flex flex-col flex-1 gap-8 w-full items-center mt-8'>
                        <Accordion type='multiple' className="!border-none !divide-none w-full">
                            {myDigitalProducts
                                ?.map(digitalProduct => (
                                <DigitalProduct buy={false} user={user!} locale={params.locale} key={digitalProduct.id} digitalProduct={digitalProduct} /> 
                            ))}
                        </Accordion>
                    </div>
                </Suspense>
            )) 
    )
}