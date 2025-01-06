import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Loading() {
    return (
        <section className='h-[90vh] w-[95%] max-lg:mx-auto lg:w-full flex flex-col gap-2 items-center justify-center'>
            <div className='w-full lg:w-screen lg:max-w-[734px] flex flex-col'>
                <div className='flex items-center justify-between gap-2'>
                    <Skeleton className="h-6 w-32" />
                    <div className='flex gap-1.5 items-center'>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
                <div className='w-full rounded-sm bg-[rgba(217,217,217,0.2)] flex flex-col gap-4 h-screen max-h-[524px] overflow-auto p-4'>
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-md" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-8 w-24" />
                        </div>
                    ))}
                </div>
            </div>
            <Link href='/cart/checkout' className='w-full max-w-[412px]'>
                <Skeleton className={cn('cursor-pointer max-w-[412px] mt-4 rounded-md h-14 w-full')} />
            </Link>
        </section>
    )
}

