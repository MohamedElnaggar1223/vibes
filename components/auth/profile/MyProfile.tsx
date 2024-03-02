'use client'

import { UserType } from "@/lib/types/userTypes"
import { Suspense, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "../../ui/dialog"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import PersonalInformation from "./PersonalInformation"
import ChangePassword from "./ChangePassword"
import MyTickets from "./MyTickets"
import Loading from '@/app/(root)/profile/loading'

type Props = {
    user: UserType
}

export default function MyProfile({ user }: Props)
{
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [selectedTab, setSelectedTab] = useState('personal')

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (loading) {
                event.preventDefault()
                event.stopPropagation()
            }
        }

        window.addEventListener('click', handleClickOutside)

        return () => {
            window.removeEventListener('click', handleClickOutside)
        }
    }, [loading])

    useEffect(() => {
        if(success !== '') setTimeout(() => setSuccess(''), 3000)
    }, [success])

    useEffect(() => {
        if(error !== '') setTimeout(() => setError(''), 3000)
    }, [error])

    return (
        <section className='flex w-full min-h-[90vh] max-h-[90vh] items-center justify-center gap-16 px-24'>
            <div className='flex flex-1 flex-col max-w-[19rem] items-center justify-center rounded-lg divide-y-[1px]'>
                <div onClick={() => setSelectedTab('personal')} className='py-8 min-w-[19rem] flex items-center justify-center rounded-t-lg bg-[rgba(82,82,82,0.60)] cursor-pointer'>
                    <p className={cn('font-poppins text-base font-normal text-white', selectedTab === 'personal' && 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text')}>Personal Information</p>
                </div>
                {
                    user.provider === 'credentials' &&
                    <div onClick={() => setSelectedTab('password')} className='py-8 min-w-[19rem] flex items-center justify-center bg-[rgba(82,82,82,0.60)] cursor-pointer'>
                        <p className={cn('font-poppins text-base font-normal text-white', selectedTab === 'password' && 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text')}>Change Password</p>
                    </div>
                }
                <div onClick={() => setSelectedTab('tickets')} className='py-8 min-w-[19rem] flex items-center justify-center rounded-b-lg bg-[rgba(82,82,82,0.60)] cursor-pointer'>
                    <p className={cn('font-poppins text-base font-normal text-white', selectedTab === 'tickets' && 'bg-[linear-gradient(90deg,rgba(231,35,119,1)50%,rgba(235,94,27,1)100%)] text-transparent bg-clip-text')}>My Tickets</p>
                </div>
            </div>
            {
                selectedTab === 'personal' ? (
                    <Suspense fallback={<Loading />}>
                        <PersonalInformation user={user} setLoading={setLoading} setError={setError} setSuccess={setSuccess} />
                    </Suspense>
                ) : selectedTab === 'password' ? (
                    <ChangePassword user={user} setLoading={setLoading} setError={setError} setSuccess={setSuccess} />
                ) : (
                    <MyTickets user={user} />
                )
            }
            
            {/* <div className='flex-1' /> */}
            <Dialog open={loading}>
                <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                    <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                </DialogContent>
            </Dialog>
            <Dialog open={success.length > 0}>
                <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                    <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                </DialogContent>
            </Dialog>
            <Dialog open={error !== ''}>
                <DialogContent className='flex items-center justify-center bg-white border-none outline-none text-center'>
                    <p className='text-black mt-2 font-poppins text-lg font-semibold text-center'>{error}</p>
                </DialogContent>
            </Dialog>
            <Dialog open={success !== ''}>
                <DialogContent className='flex items-center justify-center bg-white border-none outline-none text-center'>
                    <p className='text-black mt-2 font-poppins text-lg font-semibold text-center'>{success}</p>
                </DialogContent>
            </Dialog>
        </section>
    )
}