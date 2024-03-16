'use client'
import Image from "next/image";
import { useState } from "react";

export default function SearchBar() 
{
    const [search, setSearch] = useState('')

    return (
        <div className='w-full max-w-[627px] bg-white flex gap-4 rounded-md items-center justify-evenly px-4 mt-12'>
            <Image
                src='/assets/searchIcon.svg'
                width={28}
                height={28}
                alt='search'
                className='mr-[-5px] cursor-pointer' 
            />
            <input 
                className='flex-1 my-2 p-0 border-x-[1px] border-[#E5E5E5] text-[10px] font-poppins pl-8 py-1.5 outline-none' 
                placeholder='Search our events'
            />
            <Image
                src='/assets/settingsIcon.svg'
                width={20}
                height={20}
                alt='search' 
                className='ml-[-5px] cursor-pointer' 
            />
        </div>
    )
}
