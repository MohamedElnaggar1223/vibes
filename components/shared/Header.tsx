import Image from "next/image";
import Link from "next/link";

export default function Header() 
{
    return (
        <section className='py-2 w-full flex justify-between items-center sticky top-0 z-[9999]'>
            <Image
                src="/assets/logo.png"
                width={200}
                height={200}
                alt="logo"
                className=' z-[9999]'
            /> 
            <div className="flex gap-8 lg:gap-24 items-center z-[9999]">
                <Link href='/' className='text-white font-poppins text-lg font-[300] z-[9999]'>
                    Categories
                </Link>
                <Link href='/' className='text-white font-poppins text-lg font-[300] z-[9999]'>
                    Sell Your Tickets
                </Link>
                <Link href='/' className='text-white font-poppins text-lg font-semibold z-[9999]'>
                    AR
                </Link>
                <button className='font-poppins text-[16px] bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] rounded-full px-6 py-2 text-white z-[9999]'>
                    Sign in
                </button>
            </div>
        </section>
    )
}
