import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Separator } from "../ui/separator";
import HeaderLinks from "./HeaderLinks";
import { cn } from "@/lib/utils";
import ProfileHeader from "./ProfileHeader";

export default async function Header() 
{
    const session = await getServerSession()

    return (
        <section className='py-2 px-20 min-w-full flex justify-between items-center sticky top-0 z-[9999] bg-black'>
            <Link href='/'>
                <Image
                    src="/assets/logo.png"
                    width={195}
                    height={73}
                    alt="logo"
                    className='cursor-pointer z-[9999]'
                    priority
                    style={{
                        width: '195px',
                        height: '73px',
                    }}
                /> 
            </Link>
            <div className="flex gap-8 lg:gap-24 items-center z-[9999]">
                {/* <Link href='/' className='text-white font-poppins text-lg font-[300] z-[9999]'>
                    Categories
                </Link>
                <Link href='/' className='text-white font-poppins text-lg font-[300] z-[9999]'>
                    Sell Your Tickets
                </Link> */}
                <Link href='/' className='text-white font-poppins text-lg font-semibold z-[9999]'>
                    AR
                </Link>
                {
                    !session?.user ? (
                        <Link href='/sign-in'>
                            <button className='font-poppins text-[16px] bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] rounded-full px-6 py-2 text-white z-[9999]'>
                                Sign in
                            </button>
                        </Link>
                    ) : (
                        <Select>
                            <ProfileHeader />
                            <SelectContent className='z-[999999] w-[240px] border-t-8 border-b-0 border-x-0 border-[#E72377] rounded-b-md right-[35%] p-0'>
                                <SelectGroup className='bg-white flex flex-col items-center justify-center'>
                                    <Link prefetch={true} href='/profile' className='cursor-pointer px-8 py-4 font-poppins font-normal text-base w-full text-center'>
                                        <span >Account Details</span>
                                    </Link>
                                    <Separator color="black" />
                                    <HeaderLinks />
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )
                }
            </div>
        </section>
    )
}
