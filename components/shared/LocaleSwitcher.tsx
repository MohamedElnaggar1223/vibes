'use client'
import { useRouter } from "next/navigation"

export default function LocaleSwitcher({ params }: { params: { locale?: string | undefined } }) 
{
    const router = useRouter()

    return (
        <p onClick={() => router.push(params.locale === 'en' ? '/ar' : '/en')} className='text-white font-poppins text-sm md:text-lg font-semibold'>
            {params.locale === 'en' ? 'AR' : 'EN'}
        </p>    
    )
}