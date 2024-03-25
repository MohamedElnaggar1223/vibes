export default function SearchLoading() 
{
    return (
        <section className='flex flex-col items-center justify-center w-full overflow-x-hidden flex-1 h-max'>
            <p className='text-left font-poppins font-thin text-white text-xs mr-auto'>Showing () results</p>
            <div className='w-full flex justify-start items-center gap-8 flex-wrap mb-auto mt-12'>
                {[...Array(24)].map((_, i) => (
                    <div key={i} className='bg-[#6F6F6F] min-w-48 min-h-48 animate-pulse rounded-lg' />
                ))}
            </div>
        </section>
    )
}