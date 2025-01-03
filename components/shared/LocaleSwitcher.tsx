'use client'
import { usePathname, useRouter } from "next/navigation"

export default function LocaleSwitcher({ params }: { params: { locale?: string | undefined } }) {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <p onClick={() => router.push(params.locale === 'en' ? '/ar' + pathname! : pathname?.replace('/ar', '/en')!)} className='text-white font-poppins max-md:text-center max-md:py-2 text-lg font-semibold cursor-pointer'>
            {params.locale === 'en' ? 'AR' : 'EN'}
        </p>
    )
}