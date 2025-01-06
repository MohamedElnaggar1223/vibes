import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <section className='lg:h-[90vh] w-[95%] lg:w-full flex gap-6 items-center justify-center max-lg:py-8 max-lg:mx-auto max-lg:flex-col-reverse'>
            <div className='w-full lg:w-screen lg:max-w-[734px] flex flex-col'>
                <div className='flex items-center justify-between gap-2 mb-4'>
                    <Skeleton className="h-6 w-32" />
                    <div className='flex gap-1.5 items-center'>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
                <div className='w-full rounded-sm bg-[rgba(217,217,217,0.2)] flex flex-col gap-4 h-screen max-h-[524px] overflow-auto p-4'>
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-16 w-16 rounded-md" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-full lg:w-[400px] flex flex-col gap-4'>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </section>
    )
}

