'use client'
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

type Props = {
    locale?: string | undefined
}

export default function SearchBar({ locale }: Props) 
{
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const { t } = useTranslation()

    const [search, setSearch] = useState(searchParams?.get('search') || '')
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [category, setCategory] = useState(searchParams?.get('category') || '')
    const [date, setDate] = useState<Date | undefined>(!!searchParams?.get('date') ? parseISO(searchParams?.get('date')!) : undefined)
    const [country, setCountry] = useState(searchParams?.get('country') || '')
    const [calendarOpen, setCalendarOpen] = useState(false)

    const todaysDate = new Date()
    const tomorrow = new Date(todaysDate)
    tomorrow.setDate(todaysDate.getDate() + 1)

    const router = useRouter()

    const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        let query = ''
        if(search) query += `search=${search}&`
        if(category) query += `category=${category}&`
        if(date) query += `date=${date.toISOString()}&`
        if(country) query += `country=${country}`
        if(query) router.push(`/?${query}`)
    }

    const dropdownRef = useRef<HTMLDivElement>(null)
    const dropdownIconRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            if(event.target === dropdownIconRef.current) return
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setFiltersOpen(false)
            }
        };

        document.addEventListener('click', handleOutsideClick)

        return () => {
            document.removeEventListener('click', handleOutsideClick)
        };
    }, []);

    const handleSelectDate = (date: Date | undefined) => {
        setDate(date);
        setCalendarOpen(false)
    }

    return (
        <div dir={locale === 'ar' ? 'rtl' : 'ltr'} className='relative w-full max-w-[647px] bg-white flex shadow-lg z-[999999] gap-4 rounded-md items-center justify-evenly px-4 mt-12'>
            <Image
                src='/assets/searchIcon.svg'
                width={24}
                height={24}
                alt='search'
                className='mr-[-5px] cursor-pointer max-lg:w-[20px] max-lg:h-[20px]' 
                onClick={() => handleSubmit()}
            />
            <form                    
                className={cn('flex flex-1 my-2 p-0 border-x-[1px] border-[#E5E5E5] text-[10px] font-poppins py-0.5 md:py-1.5 outline-none', locale === 'ar' ? 'pr-8' : 'pl-8')} 
                onSubmit={handleSubmit}
            >
                <input 
                    placeholder={t('search')}
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
                className='ml-[-5px] cursor-pointer max-lg:w-[16px] max-lg:h-[16px]' 
                onClick={() => setFiltersOpen(prev => !prev)}
                ref={dropdownIconRef}
            />
            {filtersOpen && (
                <div onClick={(e) => e.stopPropagation()} ref={dropdownRef} className='absolute w-screen max-w-[647px] z-[999999999] bg-[#FFFEFE] flex flex-col text-sm top-[95%] gap-4 px-8 py-4'>
                    <div className='flex flex-wrap'>
                        <div className='flex flex-col items-start justify-evenly w-[300px] gap-3 pt-2 max-sm:mx-auto'>
                            <p className='font-poppins font-light text-black'>{t('categories')}</p>
                            <div className='flex gap-6 w-full'>
                                <p onClick={() => setCategory(prev => prev !== 'Sports' ? 'Sports' : '')} className={cn('font-poppins font-extralight cursor-pointer', category === 'Sports' ? 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text' : 'text-black')}>{t('sports')}</p>
                                <p onClick={() => setCategory(prev => prev !== 'Concerts' ? 'Concerts' : '')} className={cn('font-poppins font-extralight cursor-pointer', category === 'Concerts' ? 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text' : 'text-black')}>{t('concerts')}</p>
                                <p onClick={() => setCategory(prev => prev !== 'TheatreComedy' ? 'TheatreComedy' : '')} className={cn('font-poppins font-extralight cursor-pointer', category === 'TheatreComedy' ? 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text' : 'text-black')}>{t('theatre')}</p>
                            </div>
                            <Separator />
                        </div>
                        <div className='flex flex-col items-start justify-evenly w-[275px] bg-[#FAF9F9] gap-3 px-1 pt-2 pb-4 max-sm:mx-auto'>
                            <p className='font-poppins font-light text-black w-full text-center'>{t('chooseDate')}</p>
                            <div className='flex gap-0.5 w-full items-center justify-between'>
                                <p onClick={() => setDate(todaysDate)} className={cn('font-poppins font-extralight cursor-pointer w-fit', date?.getDate() === todaysDate?.getDate() ? 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text' : 'text-black')}>{t('today')}</p>
                                <p onClick={() => setDate(tomorrow)} className={cn('font-poppins font-extralight cursor-pointer w-fit', date?.getDate() === tomorrow?.getDate() ? 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text' : 'text-black')}>{t('tomorrow')}</p>
                                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                    <PopoverTrigger asChild>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer justify-center w-fit"
                                        >
                                        <CalendarIcon className="h-4 w-4 cursor-pointer" />
                                        {date ? <span className='font-poppins font-extralight'>{format(date, "PPP")}</span> : <span className='font-poppins font-extralight text-nowrap'>{t('selectDate')}</span>}
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 z-[9999999999]">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={handleSelectDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className='flex flex-col sm:mt-2 items-start justify-evenly w-[312px] gap-3 max-sm:mx-auto'>
                            <p className='font-poppins font-light text-black'>{t('selectCountry')}</p>
                            <div className='flex gap-12 w-full items-center justify-start'>
                                <p onClick={() => setCountry(prev => prev !== 'UAE' ? 'UAE' : '')} className={cn('font-poppins font-extralight cursor-pointer', country === 'UAE' ? 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text' : 'text-black')}>{t('UAE')}</p>
                                <p onClick={() => setCountry(prev => prev !== 'KSA' ? 'KSA' : '')} className={cn('font-poppins font-extralight cursor-pointer', country === 'KSA' ? 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text' : 'text-black')}>{t('KSA')}</p>
                                <p onClick={() => setCountry(prev => prev !== 'Egypt' ? 'Egypt' : '')} className={cn('font-poppins font-extralight cursor-pointer', country === 'Egypt' ? 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text' : 'text-black')}>{t('Egypt')}</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex items-center justify-end'>
                        <button onClick={() => handleSubmit()} disabled={![country, date, category].some(element => !!element)} className={cn('rounded-lg px-1.5 py-1 outline-none font-poppins font-light text-white', [country, date, category].some(element => !!element) ? 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] cursor-pointer' : 'bg-[#D9D9D9]')}>
                            {t('applyFilters')}
                        </button>
                        {[country, date, category].some(element => !!element) && (
                            <button onClick={() => {
                                setCountry('')
                                setDate(undefined)
                                setCategory('')
                                router.push(`/?search=${search}`)
                                // handleSubmit()
                            }} className={cn('rounded-lg px-1.5 py-1 outline-none font-poppins font-light text-white bg-[#D9D9D9] cursor-pointer', pathname?.includes('/ar') ? 'mr-4' : 'ml-4')}>
                                {t('clearFilters')}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
