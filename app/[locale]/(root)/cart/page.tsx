import Image from "next/image";
import Link from "next/link";

export default function Cart()
{
    return (
        <section className='h-[80vh] w-full flex flex-col gap-2 items-center justify-center'>
            <div className='relative flex'>
                <Image
                    src='/assets/ghost.svg'
                    width={200}
                    height={105}
                    alt='ghost' 
                    className="z-20"
                />
                <div className='absolute z-10 rounded-full w-32 h-32 bg-white opacity-20 top-6 right-10' />
            </div>
            <p className='text-white font-poppins text-xl font-light -mt-6'>No Items in Bag...</p>
            <p className='text-white font-poppins text-xl font-light mt-3 profile-span'>Browse <Link href='/'><span className='underline decoration-[rgba(231,35,119,1)] underline-offset-4'>Events & Tickets</span></Link></p>
        </section>
    )
}