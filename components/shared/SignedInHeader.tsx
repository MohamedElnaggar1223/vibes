'use client'
import Link from "next/link"
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue } from "../ui/select";
import HeaderLinks from "./HeaderLinks";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";
import CartHeaderLink from "./CartHeaderLink";
import { UserType } from "@/lib/types/userTypes";

type Props = {
    user: UserType
}

export default function SignedInHeader({ user }: Props) {
    const pathname = usePathname()

    const { t } = useTranslation()

    const [open, setOpen] = useState(false)
    const [accountMenu, setAccountMenu] = useState(false)
    const [currentWidth, setCurrentWidth] = useState<number>()

    useEffect(() => {
        if (window) setCurrentWidth(window?.innerWidth!)
    }, [])

    useEffect(() => {
        if (!open) setAccountMenu(false)
    }, [open])

    useEffect(() => {
        const handleResize = () => setCurrentWidth(window?.innerWidth!)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <>
            <CartHeaderLink user={user} />
            <Select onOpenChange={setOpen} open={open}>
                <SelectTrigger className={cn("w-[68px] lg:w-[140px] max-md:!p-0 border-none bg-transparent text-white font-poppins max-md:flex max-md:items-center max-md:justify-center max-md:w-full max-md:py-2 text-base font-medium z-[999999] outline-none", pathname === '/profile' && 'profile-span')}>
                    <SelectValue placeholder={t('profile')} />
                </SelectTrigger>
                <SelectContent className={cn('z-[9999999999999999] w-[240px] max-md:w-full max-md:right-1.5 border-t-8 border-b-0 border-x-0 border-[#E72377] rounded-b-md p-0', pathname?.startsWith('/ar') ? 'left-[5%] lg:left-[5%]' : 'right-[5%] lg:right-[35%]')}>
                    <SelectGroup className='bg-white flex flex-col items-center justify-center'>
                        {
                            !accountMenu ? (
                                <>
                                    {
                                        (currentWidth ?? 0) < 1024 ? (
                                            <span
                                                onClick={() => {
                                                    setAccountMenu(true)
                                                }}
                                                className='cursor-pointer px-8 py-4 font-poppins font-normal text-base w-full text-center'
                                            >
                                                <span>{t('accountDetails')}</span>
                                            </span>
                                        ) : (
                                            <Link
                                                onClick={() => {
                                                    setOpen(false)
                                                }}
                                                prefetch={true}
                                                href='/profile'
                                                className='cursor-pointer px-8 py-4 font-poppins font-normal text-base w-full text-center'
                                            >
                                                <span>{t('accountDetails')}</span>
                                            </Link>
                                        )
                                    }
                                    <Separator color="black" />
                                    <HeaderLinks setOpen={setOpen} />
                                </>
                            ) : (
                                <>
                                    <Link
                                        onClick={() => {
                                            setOpen(false)
                                        }}
                                        prefetch={true}
                                        href='/profile?show=personal'
                                        className='cursor-pointer px-8 py-4 font-poppins font-normal text-base w-full text-center'
                                    >
                                        <span>{t('personalInformation')}</span>
                                    </Link>
                                    <Separator color="black" />
                                    <Link
                                        onClick={() => {
                                            setOpen(false)
                                        }}
                                        prefetch={true}
                                        href='/profile?show=change-password'
                                        className='cursor-pointer px-8 py-4 font-poppins font-normal text-base w-full text-center'
                                    >
                                        <span>{t('changePassword')}</span>
                                    </Link>
                                    <Separator color="black" />
                                    <Link
                                        onClick={() => {
                                            setOpen(false)
                                        }}
                                        prefetch={true}
                                        href='/profile?show=my-tickets'
                                        className='cursor-pointer px-8 py-4 font-poppins font-normal text-base w-full text-center'
                                    >
                                        <span>{t('myTickets')}</span>
                                    </Link>
                                </>
                            )
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}