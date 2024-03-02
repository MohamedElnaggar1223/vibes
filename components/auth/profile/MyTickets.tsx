'use client'
import { UserType } from "@/lib/types/userTypes";
import { cn } from "@/lib/utils";
import { Suspense, useState } from "react";
import CurrentTickets from "./tickets/CurrentTickets";
import PastTickets from "./tickets/PastTickets";
import TicketsLoading from "./tickets/TicketsLoading";

type Props = {
    user: UserType,
}

export default function MyTickets({ user }: Props)
{
    const [selectedTab, setSelectedTab] = useState('current')

    return (
        <div className='flex flex-1 flex-col items-center justify-center min-h-[60%] max-h-[60%]'>
            <div className='flex items-start justify-between px-12 gap-12 h-fit'>
                <button onClick={() => setSelectedTab('current')} className={cn('px-2 py-2 font-poppins text-white bg-gradient-to-r rounded-md', selectedTab === 'current' ? 'font-semibold from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]' : 'font-light bg-transparent')}>Current Tickets</button>
                <button onClick={() => setSelectedTab('past')} className={cn('px-2 py-2 font-poppins text-white bg-gradient-to-r rounded-md', selectedTab === 'past' ? 'font-semibold from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]' : 'font-light bg-transparent')}>Past Tickets</button>
            </div>
            <div className='flex flex-col flex-1 w-full items-center justify-start mt-8 overflow-auto gap-12'>
                {
                    selectedTab === 'current' ? (
                        <Suspense fallback={<TicketsLoading />}>
                            <CurrentTickets user={user} />
                        </Suspense>
                    ) : (
                        <Suspense fallback={<TicketsLoading />}>
                            <PastTickets user={user} />
                        </Suspense>
                    )
                }
            </div>
            
        </div>
    )
}