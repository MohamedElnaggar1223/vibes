export default function InfoLoading()
{
    return (
        <section className='flex w-full min-h-[85vh] items-center justify-center gap-16'>
            <div className='flex flex-1 flex-col items-center justify-center rounded-lg divide-y-[1px]'>
                <div className='py-8 min-w-[19rem] bg-[rgba(217,217,217,0.2)] flex items-center justify-center rounded-t-lg'>
                    <p className='w-[12rem] py-2 rounded-lg bg-[rgba(217,217,217,0.2)] animate-pulse'></p>
                </div>
                <div className='py-8 min-w-[19rem] bg-[rgba(217,217,217,0.2)] flex items-center justify-center '>
                    <p className='w-[12rem] py-2 rounded-lg bg-[rgba(217,217,217,0.2)] animate-pulse'></p>
                </div>
                <div className='py-8 min-w-[19rem] bg-[rgba(217,217,217,0.2)] flex items-center justify-center rounded-b-lg'>
                    <p className='w-[12rem] py-2 rounded-lg bg-[rgba(217,217,217,0.2)] animate-pulse'></p>
                </div>
            </div>
            <div className='flex flex-1 flex-col space-y-10 justify-center items-center'>
                <p className='min-w-[9rem] py-2 rounded-lg mb-4 bg-[rgba(217,217,217,0.2)] animate-pulse'></p>
                <p className='max-w-[412px] w-screen py-8 min-h-[4rem] rounded-lg bg-[rgba(217,217,217,0.2)] animate-pulse'></p>
                <p className='max-w-[412px] w-screen py-8 min-h-[4rem] rounded-lg bg-[rgba(217,217,217,0.2)] animate-pulse'></p>
                <p className='max-w-[412px] w-screen py-8 min-h-[4rem] rounded-lg bg-[rgba(217,217,217,0.2)] animate-pulse'></p>
                <p className='max-w-[412px] w-screen py-8 min-h-[4rem] rounded-lg bg-[rgba(217,217,217,0.2)] animate-pulse'></p>
                <p className='max-w-[412px] w-screen py-8 min-h-[4rem] rounded-lg bg-[rgba(217,217,217,0.2)] animate-pulse'></p>
            </div>
            <div className='flex-1' />
        </section>    
    )
}