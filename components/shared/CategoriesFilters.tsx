'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, FilterX } from "lucide-react";
import Image from "next/image";

export default function CategoriesFilters()
{
    const searchParams = useSearchParams()
    const router = useRouter()

    const [country, setCountry] = useState(searchParams?.get('country') || '')
    const [date, setDate] = useState<Date | undefined>(!!searchParams?.get('date') ? parseISO(searchParams?.get('date')!) : undefined)
    const todaysDate = new Date()
    const tomorrow = new Date(todaysDate)
    tomorrow.setDate(todaysDate.getDate() + 1)

    useEffect(() => {
        let query = ''
        if(date) query += `date=${date.toISOString()}&`
        if(country) query += `country=${country}`
        if(query) router.push(`/categories/?${query}`)
    }, [date, country])

    return (
        <>
            <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                    <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent className='p-0'>
                    <SelectItem value='KSA'>KSA</SelectItem>
                    <SelectItem value='UAE'>UAE</SelectItem>
                    <SelectItem value='Egypt'>Egypt</SelectItem>
                </SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger className="font-poppins bg-white py-3 pl-3.5 pr-3 text-xs rounded-md" asChild>
                    <div className='w-full flex justify-between'>
                        <p>{date ? format(date, "PPP") : 'Date'}</p>
                        <Image
                            src='/assets/dropdownFilters.svg'
                            width={16}
                            height={16}
                            alt='dropdown' 
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent className='max-w-48 px-1'>
                    <p onClick={() => setDate(todaysDate)} className='relative hover:bg-accent flex w-full cursor-default select-none items-start rounded-sm py-1.5 pl-4 pr-2 text-sm outline-none'>Today</p>
                    <p onClick={() => setDate(tomorrow)} className='relative hover:bg-accent flex w-full cursor-default select-none items-start rounded-sm py-1.5 pl-4 pr-2 text-sm outline-none'>Tomorrow</p>
                    <Popover>
                        <PopoverTrigger asChild>
                            <div
                                className="flex gap-1 cursor-pointer justify-start w-full relative hover:bg-accent select-none items-start rounded-sm py-2 pl-4 pr-2 text-sm outline-none"
                            >
                            <CalendarIcon className="h-4 w-4 cursor-pointer" />
                            {date ? <span className='font-poppins font-extralight text-xs'>{format(date, "PPP")}</span> : <span className='font-poppins font-extralight text-nowrap text-xs'>Select date</span>}
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[9999999999]">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </PopoverContent>
            </Popover>
            {[country, date].some(element => !!element) && (
                <button onClick={() => {
                    setCountry('')
                    setDate(undefined)
                    router.push('/categories')
                }} className='rounded-md self-center px-1 lg:px-1.5 py-1 outline-none font-poppins font-light text-white bg-[#D9D9D9] lg:ml-4 cursor-pointer text-xs w-16 lg:w-24'>
                    <span className='max-lg:hidden'>Clear Filters</span>
                    <FilterX className='lg:hidden w-5 h-5' />
                </button>
            )}
        </>
    )
}