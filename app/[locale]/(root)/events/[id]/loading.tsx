export default function Loading() 
{
    return (
        <section className='flex flex-col w-full my-1 md:flex-row'>
            <div className='flex flex-col w-full max-w-[412px] rounded-xl bg-[rgba(217,217,217,0.2)] gap-1'>
                <div className='w-full object-contain h-full min-h-[212px] overflow-hidden animate-pulse bg-[#3F3F3F]'>

                </div>
                <div className='flex flex-col p-3 gap-4'>
                    <p className='font-poppins text-2xl font-bold text-white w-1/4 p-2 bg-[#3F3F3F] animate-pulse rounded-xl'></p>
                    <div className='w-full flex justify-between items-center'>
                        <p className='font-poppins text-sm font-extralight text-white w-2/5 p-2 bg-[#3F3F3F] animate-pulse rounded-xl'></p>
                        <p className='font-poppins text-sm font-extralight text-white mr-4 w-1/4 p-2 bg-[#3F3F3F] animate-pulse rounded-xl'></p>
                    </div>
                    <p className='font-poppins text-sm font-extralight text-white w-2/5 p-2 bg-[#3F3F3F] animate-pulse rounded-xl'></p>
                    <p className='font-poppins text-sm font-extralight text-white w-2/5 p-2 bg-[#3F3F3F] animate-pulse rounded-xl'></p>
                    <div className='flex text-center w-full border-y-[1px] border-[#fff] py-4'>
                        <p className='font-poppins text-sm font-extralight text-white p-28 w-full bg-[#3F3F3F] animate-pulse rounded-xl'></p>
                    </div>
                    <div className='flex flex-col items-start justify-center w-full gap-4'>
                        <div className='flex gap-2 justify-evenly items-center w-full'>
                            <div className='w-1/6 flex items-center justify-center h-full py-4 rounded-full bg-[#3F3F3F] animate-pulse'>

                            </div>
                            <p className='font-poppins text-sm font-extralight text-white w-full p-2 bg-[#3F3F3F] animate-pulse rounded-xl'></p>
                        </div>
                        <div className='flex gap-2 justify-evenly items-center w-full'>
                            <div className='w-1/6 flex items-center justify-center h-full py-4 rounded-full bg-[#3F3F3F] animate-pulse'>

                            </div>
                            <p className='font-poppins text-sm font-extralight text-white w-full p-2 bg-[#3F3F3F] animate-pulse rounded-xl'></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-1'>
                
            </div>
        </section>
    )
}
