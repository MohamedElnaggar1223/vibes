import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import SignedInHeader from "./SignedInHeader";

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
                        <SignedInHeader />
                    )
                }
            </div>
        </section>
    )
}
