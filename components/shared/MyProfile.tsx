'use client'

import { UserType } from "@/lib/types/userTypes"

type Props = {
    user: UserType
}

export default function MyProfile({ user }: Props)
{
    return (
        <section className='flex w-full min-h-[90vh] items-center justify-center gap-16'>
            <div className='flex flex-1 flex-col items-center justify-center rounded-lg divide-y-[1px]'>
                <div className='py-8 min-w-[19rem] flex items-center justify-center rounded-t-lg bg-[rgba(82,82,82,0.60)]'>
                    <p className='font-poppins text-base font-normal text-white'>Personal Information</p>
                </div>
                <div className='py-8 min-w-[19rem] flex items-center justify-center bg-[rgba(82,82,82,0.60)]'>
                    <p className='font-poppins text-base font-normal text-white'>Change Password</p>
                </div>
                <div className='py-8 min-w-[19rem] flex items-center justify-center rounded-b-lg bg-[rgba(82,82,82,0.60)]'>
                    <p className='font-poppins text-base font-normal text-white'>My Tickets</p>
                </div>
            </div>
            <div></div>
        </section>
    )
}