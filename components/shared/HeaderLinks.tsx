'use client'

import { Separator } from "../ui/separator"
import { auth } from "@/firebase/client/config"
import { signOut } from "next-auth/react"
import Image from "next/image"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dispatch, SetStateAction, memo, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { CountryContext } from "@/providers/CountryProvider"
import { Dialog, DialogContent } from "../ui/dialog"
import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import Link from "next/link"

type Props = {
    setOpen: Dispatch<SetStateAction<boolean>>
}

function HeaderLinks({ setOpen }: Props) 
{
    const context = useContext(CountryContext)
    if(!context) return null

    const { country, setCountry } = context

    const [loading, setLoading] = useState(false)
    const [countryOpen, setCountryOpen] = useState(false)
    const [canLogOut, setCanLogOut] = useState(true)

    const { t } = useTranslation()

    const router = useRouter()

    const countries = { 'SAR': 'KSA', 'AED': 'UAE', 'EGP': 'EG' }

    const handleLogout = async () => {
        if(canLogOut)
        {
            setOpen(false)
            setLoading(true)
            await auth.signOut()
            await signOut()
            setLoading(false)
        }
    }

    useEffect(() => {
        if(countryOpen) setCanLogOut(false)
        else
        {
            setTimeout(() => setCanLogOut(true), 500) 
        }
    }, [countryOpen])

    const defaultValue = useMemo(() => {
        //@ts-expect-error country
        return countries[country]
    }, [country])

    return (
        <>
            <Link onClick={() => setOpen(false)} href='/hotel-reservations' className="cursor-pointer items-center justify-center px-8 py-4 font-poppins font-normal text-base w-full text-center flex gap-4">Hotel Reservations</Link>
            <Separator color="black" />
            <Link onClick={() => setOpen(false)} href='/digital-products' className="cursor-pointer items-center justify-center px-8 py-4 font-poppins font-normal text-base w-full text-center flex gap-4">Digital Products</Link>
            <Separator color="black" />
            <span onClick={(e) => e.stopPropagation()} className='items-center justify-center flex gap-4 px-8 py-4 font-poppins font-normal text-base w-full text-center z-[99999999999999999]'>
                {t('selectCountry')}
                <Select open={countryOpen} onOpenChange={setCountryOpen} defaultValue={defaultValue} onValueChange={(value) => {
                    //@ts-expect-error country
                    setCountry(Object.keys(countries).find(key => countries[key] === value))
                    //@ts-expect-error country
                    localStorage.setItem('country', Object.keys(countries).find(key => countries[key] === value))
                    router.refresh()
                }}>
                    <SelectTrigger className="w-[140px] border-none bg-black text-white font-poppins text-base font-medium outline-none">
                        <SelectValue placeholder={defaultValue} />
                    </SelectTrigger>
                    <SelectContent className='z-[999999999999999999] bg-black w-[80px] rounded-b-md p-0'>
                        <SelectGroup className='bg-black flex flex-col items-center justify-center'>
                            <SelectItem className='bg-black text-white font-poppins cursor-pointer' value="KSA">{t('KSA')}</SelectItem>
                            <SelectItem className='bg-black text-white font-poppins cursor-pointer' value="EG">{t('EG')}</SelectItem>
                            <SelectItem className='bg-black text-white font-poppins cursor-pointer' value="UAE">{t('UAE')}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </span>
            <Separator color="black" />
            <span onClick={handleLogout} className='cursor-pointer items-center justify-center px-8 py-4 font-poppins font-normal text-base w-full text-center flex gap-4'>
                <Image
                    src='/assets/logout.svg'
                    width={18}
                    height={16} 
                    alt='logout'
                />
                {t('logOut')}
            </span>
            <Dialog open={loading}>
                <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                    <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                </DialogContent>
			</Dialog>
        </>
    )
}

const memoizedHeaderLinks = memo(HeaderLinks)
export default memoizedHeaderLinks