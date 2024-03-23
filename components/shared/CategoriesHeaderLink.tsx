'use client'
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoriesHeaderLink() 
{
    const pathname = usePathname()

    return (
        <Link href='/categories' className={cn('font-poppins text-sm md:text-lg font-[300] z-[9999]', pathname?.includes('/categories') ? 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text' : 'text-white')}>
            Categories
        </Link>
    )
}