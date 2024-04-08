import { initAdmin } from "@/firebase/server/config"
import { initTranslations } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

type Props = {
    params: {
        id: string
        locale: string | undefined
    }
}

export default async function SuccessPage({ params }: Props)
{
    const { t } = await initTranslations(params.locale!, ['homepage', 'common'])

    const admin = await initAdmin()
    const ticket = await admin.firestore().collection('tickets').doc(params.id).get()

    if(!ticket.exists) return redirect('/')

    revalidatePath('/profile?show=my-tickets')

    return (
        <section className='h-screen w-full flex items-center justify-center'>
            <div className='max-w-[40rem] w-screen rounded-3xl flex flex-col items-center justify-center overflow-hidden'>
                <div className='bg-gradient-to-r w-full py-[4.5rem] from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] flex flex-col items-center justify-start gap-4 p-4 min-h-[40%]'>
                    <p className='font-poppins font-semibold text-white text-xl'>{t('awesome')}</p>
                    <p className='font-poppins font-light text-white text-xl'>{t('transaction')}</p>
                </div>
                <div className='h-3/5 flex flex-col items-center justify-center gap-4 p-4 bg-[#181C25] w-full py-12'>
                    <Image
                        src='/assets/success.svg' 
                        width={350}
                        height={231}
                        alt='success'
                        className='mt-[-7rem]'
                    />
                    <p className='font-poppins font-light text-white text-sm text-center mx-2 lg:mx-24 my-6'>{t('goTo')} <Link href='/profile?show=my-tickets' className='underline'>{t('myTickets')} </Link>{t('viewTickets')} <Link href='/' className='underline'>{t('hompeage')}</Link></p>
                </div>
            </div>
        </section>
    )
}