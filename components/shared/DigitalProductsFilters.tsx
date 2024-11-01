'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FilterX } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
    locale?: string | undefined
}

export default function DigitalProductsFilters({ locale }: Props)
{
    const searchParams = useSearchParams()
    
    const router = useRouter()

    const { t } = useTranslation()

    const [category, setCategory] = useState(searchParams?.get('category') || '')

    useEffect(() => {
        let query = ''
        if(category) query += `category=${category}`
        if(query) router.push(`/digital-products/?${query}`)
    }, [category])

    return (
        <>
            <Select dir={locale === 'ar' ? 'rtl' : 'ltr'} value={category} onValueChange={setCategory}>
                <SelectTrigger className='text-xs-important font-normal font-poppins'>
                    <SelectValue className='text-xs-important' placeholder={t("categories")} />
                </SelectTrigger>
                <SelectContent className='p-0'>
                    {['Vehicles'].map((cat, index) => (
                        <SelectItem className='text-xs text-xs-important' key={index} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {[category].some(element => !!element) && (
                <button 
                    onClick={() => {
                        setCategory('')
                        router.push('/digital-products')
                    }} 
                    className='rounded-md self-center px-1 lg:px-1.5 py-1 outline-none font-poppins font-light text-white bg-[#D9D9D9] lg:ml-4 cursor-pointer text-xs w-24 lg:w-24'
                >
                    <span className='max-lg:hidden'>{t('clearFilters')}</span>
                    <FilterX className='lg:hidden w-5 h-5' />
                </button>
            )}
        </>
    )
}