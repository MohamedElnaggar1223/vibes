'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SearchBar() 
{
    const [search, setSearch] = useState('')

    const router = useRouter()

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(search) router.push(`/search?search=${search}`)
    }

    return (
        <div className='w-full max-w-[627px] bg-white flex gap-4 rounded-md items-center justify-evenly px-4 mt-12'>
            <Image
                src='/assets/searchIcon.svg'
                width={28}
                height={28}
                alt='search'
                className='mr-[-5px] cursor-pointer' 
            />
            <form                    
                className='flex-1 my-2 p-0 border-x-[1px] border-[#E5E5E5] text-[10px] font-poppins pl-8 py-1.5 outline-none' 
                onSubmit={handleSubmit}
            >
                <input 
                    placeholder='Search our events'
                    className='flex-1 p-0 text-[10px] font-poppins outline-none' 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </form>
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
