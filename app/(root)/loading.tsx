import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() 
{
    return (
        <section className='w-full h-[90vh] flex items-center justify-center'>
            <Image
                src="/assets/background.svg"
                fill
                alt="background"
                className='bg-image'
                priority
            />
            <Loader2 size={52} className='animate-spin' />
        </section>
    )
}
