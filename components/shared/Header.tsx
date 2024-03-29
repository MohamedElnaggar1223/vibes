import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import SignedInHeader from "./SignedInHeader";
import CategoriesHeaderLink from "./CategoriesHeaderLink";

export default async function Header() 
{
    const session = await getServerSession()

    return (
        <section className='py-2 lg:px-20 min-w-full flex justify-between items-center sticky top-0 z-[99999999999] bg-black'>
            <Link href='/'>
                <Image
                    src="/assets/logo.png"
                    width={195}
                    height={73}
                    alt="logo"
                    className='cursor-pointer max-lg:w-[120px] max-lg:h-[45px]'
                    priority
                />
            </Link>
            <div className="flex gap-6 lg:gap-24 items-center max-lg:mr-4">
                <CategoriesHeaderLink />
                {/* <Link href='/' className='text-white font-poppins text-lg font-[300]'>
                    Sell Your Tickets
                </Link> */}
                <Link href='/' className='text-white font-poppins text-sm md:text-lg font-semibold'>
                    AR
                </Link>
                {
                    !session?.user ? (
                        <Link href='/sign-in'>
                            <button className='font-poppins text-sm md:text-[16px] bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] rounded-full px-3 py-1 md:px-6 md:py-2 text-white'>
                                Sign in
                            </button>
                        </Link>
                    ) : (
                        <SignedInHeader />
                    )
                }
            </div>
        </section>
    )
}
