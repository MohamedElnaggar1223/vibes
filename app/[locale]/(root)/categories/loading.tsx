export default function Loading() 
{
    return (
        <section className='flex max-lg:flex-col flex-1 w-full gap-6 items-start justify-start'>
            <div className='flex flex-row lg:flex-col mt-2 lg:mt-16 gap-2 w-full lg:w-48'>
                <div className='max-w-[40%] max-lg:hidden min-h-[40px] bg-[#6F6F6F] animate-pulse rounded-lg' />
                <div className='min-w-[50%] lg:min-w-full min-h-[40px] bg-[#6F6F6F] animate-pulse rounded-lg' />
                <div className='min-w-[50%] lg:min-w-full min-h-[40px] bg-[#6F6F6F] animate-pulse rounded-lg' />
            </div>
            <div className='flex flex-col flex-1 gap-8'>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className='flex flex-1 flex-col gap-4 mt-6'>
                        <div className='w-32 h-[24px] bg-[#6F6F6F] animate-pulse rounded-lg' />
                        <div className='w-full flex justify-start lg:items-center gap-6 lg:gap-8 flex-wrap max-md:justify-start'>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className='bg-[#6F6F6F] w-32 h-32 lg:w-48 lg:h-48 animate-pulse rounded-lg' />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}