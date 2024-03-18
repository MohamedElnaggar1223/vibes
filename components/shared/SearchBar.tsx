'use client'
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Separator } from "../ui/separator";

export default function SearchBar() 
{
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams?.get('search') || '')
    const [filtersOpen, setFiltersOpen] = useState(false)

    const router = useRouter()

    const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        if(search) {
            router.push(`/?search=${search}`)
        }
    }

    return (
        <div className='relative w-full max-w-[627px] bg-white flex shadow-lg z-20 gap-4 rounded-md items-center justify-evenly px-4 mt-12'>
            <Image
                src='/assets/searchIcon.svg'
                width={24}
                height={24}
                alt='search'
                className='mr-[-5px] cursor-pointer' 
                onClick={() => handleSubmit()}
            />
            <form                    
                className='flex flex-1 my-2 p-0 border-x-[1px] border-[#E5E5E5] text-[10px] font-poppins pl-8 py-1.5 outline-none' 
                onSubmit={handleSubmit}
            >
                <input 
                    placeholder='Search our events'
                    className='w-full flex-1 p-0 text-[10px] font-poppins outline-none' 
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
                onClick={() => setFiltersOpen(prev => !prev)}
            />
            {filtersOpen && (
                <div className='absolute w-screen max-w-[627px] z-10 bg-[#FFFEFE] flex flex-wrap text-sm top-[95%] gap-4 px-8 py-4'>
                    <div className='flex flex-col items-start justify-evenly w-[300px] gap-3 pt-2'>
                        <p className='font-poppins font-light text-black'>Categories</p>
                        <div className='flex gap-6 w-full'>
                            <p className='font-poppins font-extralight text-black cursor-pointer'>Sports</p>
                            <p className='font-poppins font-extralight text-black cursor-pointer'>Concerts</p>
                            <p className='font-poppins font-extralight text-black cursor-pointer'>Theatre & Comedy</p>
                        </div>
                        <Separator />
                    </div>
                    <div className='flex flex-col items-start justify-evenly w-[230px] bg-[#FAF9F9] gap-3 px-1.5 pt-2 pb-4'>
                        <p className='font-poppins font-light text-black w-full text-center'>Choose Date</p>
                        <div className='flex gap-6 w-full items-center justify-between'>
                            <p className='font-poppins font-extralight text-black cursor-pointer'>Today</p>
                            <p className='font-poppins font-extralight text-black cursor-pointer'>Tomorrow</p>
                            <p className='font-poppins font-extralight text-black cursor-pointer'>Today</p>
                        </div>
                    </div>
                    <div className='flex flex-col items-start justify-evenly w-[312px] gap-3'>
                        <p className='font-poppins font-light text-black'>Country</p>
                        <div className='flex gap-12 w-full items-center justify-start'>
                            <p className='font-poppins font-extralight text-black cursor-pointer'>UAE</p>
                            <p className='font-poppins font-extralight text-black cursor-pointer'>KSA</p>
                            <p className='font-poppins font-extralight text-black cursor-pointer'>Egypt</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
