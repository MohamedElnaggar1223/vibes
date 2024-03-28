'use client'
import { auth } from "@/firebase/client/config";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Loader2 } from "lucide-react";

export default function AuthHeader() 
{
    const [loading, setLoading] = useState(false)
    const pathname = usePathname()

    const handleLogOut = async () => {
        setLoading(true)
        await auth.signOut()
        await signOut()
        setLoading(false)
    }

    return (
        <section className='py-2 pr-4 lg:px-20 min-w-full flex justify-between items-center fixed top-0 z-[9999] bg-transparent max-lg:bg-black'>
            <Link href='/'>
                <Image
                    src="/assets/logo.png"
                    width={195}
                    height={73}
                    alt="logo"
                    className='cursor-pointer z-[9999] max-lg:w-[120px] max-lg:h-[45px]'
                /> 
            </Link>
            <div className="flex gap-8 lg:gap-24 items-center z-[9999]">
                <Link href='/' className='text-white font-poppins text-base font-semibold z-[9999]'>
                    AR
                </Link>
                {pathname === '/complete-profile' && (
                    <button onClick={handleLogOut} className='font-poppins text-sm md:text-[16px] bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] rounded-full px-3 py-1 md:px-6 md:py-2 text-white'>
                        Log Out
                    </button>
                )}
            </div>
            <Dialog open={loading}>
                <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                    <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                </DialogContent>
            </Dialog>
        </section>
    )
}
