'use client'
import Link from "next/link"
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue } from "../ui/select";
import HeaderLinks from "./HeaderLinks";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";

export default function SignedInHeader()
{
    const pathname = usePathname()

    const [open, setOpen] = useState(false)
    const [accountMenu, setAccountMenu] = useState(false)
    const [currentWidth, setCurrentWidth] = useState(window?.innerWidth!)

    useEffect(() => {
        if(!open) setAccountMenu(false)
    }, [open])

    useEffect(() => {
        const handleResize = () => setCurrentWidth(window?.innerWidth!)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <Select onOpenChange={setOpen} open={open}>
            <SelectTrigger className={cn("w-[140px] border-none bg-transparent text-white font-poppins text-base font-medium z-[999999] outline-none", pathname === '/profile' && 'profile-span')}>
                <SelectValue placeholder="Profile" />
            </SelectTrigger>
            <SelectContent className='z-[999999] w-[240px] border-t-8 border-b-0 border-x-0 border-[#E72377] rounded-b-md right-[5%] lg:right-[35%] p-0'>
                <SelectGroup className='bg-white flex flex-col items-center justify-center'>
                    {
                        !accountMenu ? (
                            <>
                                {
                                    currentWidth < 1024 ? (
                                        <span 
                                            onClick={() => {
                                                setAccountMenu(true)   
                                            }}
                                            className='cursor-pointer px-8 py-4 font-poppins font-normal text-base w-full text-center'
                                        >
                                            <span>Account Details</span>
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
                                            <span>Account Details</span>
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
                                    <span>Personal Information</span>
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
                                    <span>Change Password</span>
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
                                    <span>My Tickets</span>
                                </Link>
                            </>
                        )
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}