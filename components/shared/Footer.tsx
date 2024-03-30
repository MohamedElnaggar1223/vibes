import Image from "next/image";
import { Separator } from "../ui/separator";
import Link from "next/link";

export default function Footer() 
{
    return (
        <footer className="py-10 sm:px-8 md:px-12 lg:px-20 min-w-full flex items-start bg-[#111111] gap-2 sm:gap-8 justify-between">
            <div className="flex flex-col flex-1 mr-14 gap-4">
                <div className='w-full flex justify-between items-start mb-4 gap-2 max-sm:flex-col-reverse max-sm:ml-8 max-sm:gap-6'>
                    <div className='flex flex-col gap-2.5 items-start justify-start'>
                        <p className='font-poppins text-xs sm:text-sm bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text mb-0.5'>Download Our App</p>
                        <div className='flex gap-1.5'>
                            <Link href='/'>
                                <Image
                                    src="/assets/app-iphone.svg"
                                    width={88}
                                    height={30}
                                    alt="app-store"
                                />
                            </Link>
                            <Link href='/'>
                                <Image
                                    src="/assets/app-android.svg"
                                    width={88}
                                    height={30}
                                    alt="app-android"
                                />
                            </Link>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2.5 items-start justify-start'>
                        <p className='font-poppins text-xs sm:text-sm bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text mb-0.5'>Follow Us</p>
                        <div className='flex gap-6'>
                            <Link href='/'>
                                <Image
                                    src="/assets/instagram-footer.svg"
                                    width={20}
                                    height={20}
                                    alt="app-store"
                                />
                            </Link>
                            <Link href='/'>
                                <Image
                                    src="/assets/x-footer.svg"
                                    width={20}
                                    height={20}
                                    alt="app-android"
                                />
                            </Link>
                            <Link href='/'>
                                <Image
                                    src="/assets/facebook-footer.svg"
                                    width={20}
                                    height={20}
                                    alt="app-android"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
                <Separator className='max-sm:min-w-[calc(100vw-3rem)] max-sm:mx-6' />
                <div className='w-full flex justify-end items-end max-sm:min-w-[calc(100vw-3rem)] max-sm:mx-6'>
                    <p className='font-poppins text-white text-[9px] sm:text-xs'>©2024</p>
                    <p className='font-poppins text-white text-[9px] sm:text-xs ml-20 sm:ml-40 text-right text-nowrap'>All Copyrights reserved</p>
                </div>
            </div>
            <div className='flex flex-col gap-2.5 mr-6 ml-6 sm:ml-14 sm:mr-14'>
                <p className='font-poppins text-xs sm:text-sm bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text mb-0.5'>Get in Touch</p>
                <p className='font-poppins text-white text-xs sm:text-sm'>Vibes@gmail.com</p>
                <p className='font-poppins text-white text-xs sm:text-sm'>+20 12092283</p>
                <p className='font-poppins text-white text-xs sm:text-sm'>+966 012092283</p>
            </div>
        </footer>
    )
}