'use client'

import { cn } from "@/lib/utils"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function SearchDigitalProducts({ search, locale }: { search?: string, locale?: string }) 
{
    const router = useRouter()

    const [searchValue, setSearchValue] = useState(search || '')

    const { t } = useTranslation()

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault()

        let query = searchValue
        if(query) router.push(`/digital-products?search=${query}`)
        else router.push('/digital-products')
    }

    return (
        <div dir={locale === 'ar' ? 'rtl' : 'ltr'} className='relative w-screen max-w-[400px] bg-white flex shadow-lg z-[999999] gap-4 rounded-md items-center justify-evenly px-4'>
            <Image
                src='/assets/searchIcon.svg'
                width={24}
                height={24}
                alt='search'
                className='mr-[-5px] cursor-pointer max-lg:w-[20px] max-lg:h-[20px]' 
                onClick={() => handleSearch()}
            />
            <form                    
                className={cn('flex flex-1 my-2 p-0 border-l-[1px] border-[#E5E5E5] text-[10px] font-poppins py-0.5 md:py-1.5 outline-none', locale === 'ar' ? 'pr-8' : 'pl-8')} 
                onSubmit={handleSearch}
            >
                <input 
                    placeholder={t('searchHotels')}
                    className='w-full flex-1 p-0 text-[10px] font-poppins outline-none' 
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                />
            </form>
        </div>
    )
}