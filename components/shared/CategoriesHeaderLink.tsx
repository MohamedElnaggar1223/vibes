'use client'
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Category } from "@/lib/types/eventTypes";
import { useState } from "react";

type Props = {
    categories: Category[]
}

export default function CategoriesHeaderLink({ categories }: Props) 
{
    const pathname = usePathname()
    const { t } = useTranslation()

    const [open, setOpen] = useState(false)
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <p className={cn('font-poppins text-sm md:text-lg font-[300] z-[9999]', pathname?.includes('/categories') ? 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text' : 'text-white')}>{t('categories')}</p>
            </PopoverTrigger>
            <PopoverContent className={cn('z-[9999999999999999] w-[180px] border-t-8 border-b-0 border-x-0 border-[#E72377] rounded-b-md p-0', pathname?.startsWith('/ar') ? 'left-[5%] lg:left-[5%]' : 'right-[5%] lg:right-[35%]')}>
                <div className='px-4 divide-y'>
                    <Link onClick={() => setOpen(false)} href='/categories'>
                        <p className='cursor-pointer py-4 font-poppins font-normal text-base w-full text-center'>{pathname?.includes('/ar') ? "كل الفئات" : "All Categories"}</p>
                    </Link>
                    {categories.map((category) => (
                        <Link onClick={() => setOpen(false)} key={category.id} href={`/categories?category=${category.category}`}>
                            <p className='cursor-pointer py-4 font-poppins font-normal text-base w-full text-center'>{pathname?.includes('/ar') ? category.categoryArabic : category.category}</p>
                        </Link>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
        // <Link href='/categories' className={cn('font-poppins text-sm md:text-lg font-[300] z-[9999]', pathname?.includes('/categories') ? 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text' : 'text-white')}>
        // </Link>
    )
}