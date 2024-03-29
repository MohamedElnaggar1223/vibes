import Image from "next/image";
import { Separator } from "../ui/separator";
import Link from "next/link";

export default function Footer() 
{
    return (
        <footer className="py-10 sm:px-8 md:px-12 lg:px-20 min-w-full flex items-start bg-[#111111] gap-8 justify-between">
            <div className="flex flex-col flex-1 mr-14 gap-4">
                <div className='w-full flex justify-between items-start mb-4 gap-2'>
                    <div className='flex flex-col gap-2.5 items-start justify-start'>
                        <p className='font-poppins text-sm bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text mb-0.5'>Download Our App</p>
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
                        <p className='font-poppins text-sm bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text mb-0.5'>Follow Us</p>
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
                <Separator />
                <div className='w-full flex justify-end items-end'>
                    <p className='font-poppins text-white text-xs'>©2024</p>
                    <p className='font-poppins text-white text-xs ml-40'>All Copyrights reserved</p>
                </div>
            </div>
            <div className='ml-14 flex flex-col gap-2.5 mr-14'>
                <p className='font-poppins text-sm bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text mb-0.5'>Get in Touch</p>
                <p className='font-poppins text-white text-sm'>Vibes@gmail.com</p>
                <p className='font-poppins text-white text-sm'>+20 12092283</p>
                <p className='font-poppins text-white text-sm'>+966 012092283</p>
            </div>
        </footer>
    )
}