'use client'
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function CartHeaderLink() 
{
    const pathname = usePathname()
    const [hovered, setHovered] = useState(false)

    return (
        <Link onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} href='/cart' className={cn('font-poppins text-sm cursor-pointer md:text-lg font-[300] z-[9999] text-white transition-all')}>
            {pathname?.includes('/cart') ? (
                <Image
                    src="/assets/bag-active.svg"
                    width={19}
                    height={23}
                    alt="cart-active" 
                />
            ) : hovered ? (
                <Image
                    src="/assets/bag-hover.svg"
                    width={19}
                    height={23}
                    alt="cart-active" 
                />
            ) : (
                <Image
                    src="/assets/bag.svg"
                    width={19}
                    height={23}
                    alt="cart" 
                />
            )}
        </Link>
    )
}