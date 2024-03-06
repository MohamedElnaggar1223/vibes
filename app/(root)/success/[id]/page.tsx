import { initAdmin } from "@/firebase/server/config"
import { revalidatePath } from "next/cache"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

type Props = {
    params: {
        id: string
    }
}

export default async function SuccessPage({ params }: Props)
{
    const admin = await initAdmin()
    const ticket = await admin.firestore().collection('tickets').doc(params.id).get()

    if(!ticket.exists) return redirect('/')

    revalidatePath('/profile?show=my-tickets')

    return (
        <section className='h-screen w-full flex items-center justify-center'>
            <div className='max-w-[40rem] w-screen rounded-3xl flex flex-col items-center justify-center overflow-hidden'>
                <div className='bg-gradient-to-r w-full py-[4.5rem] from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] flex flex-col items-center justify-start gap-4 p-4 min-h-[40%]'>
                    <p className='font-poppins font-semibold text-white text-xl'>Awesome!</p>
                    <p className='font-poppins font-light text-white text-xl'>Transaction Approved..</p>
                </div>
                <div className='h-3/5 flex flex-col items-center justify-center gap-4 p-4 bg-[#181C25] w-full py-12'>
                    <Image
                        src='/assets/success.svg' 
                        width={350}
                        height={231}
                        alt='success'
                        className='mt-[-7rem]'
                    />
                    <p className='font-poppins font-light text-white text-sm text-center mx-24 my-6'>Go to <Link href='/profile?show=my-tickets' className='underline'>My Tickets</Link> to view your purchased tickets or go back to <Link href='/' className='underline'>Hompeage</Link></p>
                </div>
            </div>
        </section>
    )
}