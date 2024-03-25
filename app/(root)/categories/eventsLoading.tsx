export default function EventsLoading() 
{
    return (
        <div className='flex flex-col flex-1 gap-8'>
            {[...Array(6)].map((_, i) => (
                <div key={i} className='flex flex-1 flex-col gap-4 mt-6'>
                    <div className='w-32 h-[24px] bg-[#6F6F6F] animate-pulse rounded-lg' />
                    <div className='w-full flex justify-start items-center gap-8 flex-wrap max-md:justify-center'>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className='bg-[#6F6F6F] w-48 h-48 animate-pulse rounded-lg' />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}