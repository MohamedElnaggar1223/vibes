import Image from "next/image";
import Link from "next/link";

export default function AuthHeader() 
{
    return (
        <section className='py-2 px-20 min-w-full flex justify-between items-center fixed top-0 z-[9999] bg-transparent'>
            <Link href='/'>
                <Image
                    src="/assets/logo.png"
                    width={200}
                    height={200}
                    alt="logo"
                    className='cursor-pointer z-[9999]'
                /> 
            </Link>
            <div className="flex gap-8 lg:gap-24 items-center z-[9999]">
                <Link href='/' className='text-white font-poppins text-base font-semibold z-[9999]'>
                    AR
                </Link>
            </div>
        </section>
    )
}
