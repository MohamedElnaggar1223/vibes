'use client'

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

export default function PurchaseTickets() 
{
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <div className='relative flex-1 flex flex-col py-2 px-2 gap-6 max-lg:w-full'>
            <div className='w-full flex justify-between items-center gap-4'>
                <div />
                <button onClick={() => setDialogOpen(true)} className='text-white font-poppins font-semibold text-sm py-5 px-8 bg-[#232834] rounded-lg'>
                    Choose Your Tickets
                </button>
                <button className='text-white font-poppins font-semibold text-sm py-5 px-8 bg-[#232834] rounded-lg'>
                    Map
                </button>
            </div>
            <div className='flex-1 w-full flex items-center justify-center'>
                <div className='py-6 px-14 bg-[rgba(255,255,255,0.15)] text-white font-poppins font-semibold text-sm rounded-lg'>
                    {"Choose Your Tickets & They’ll Appear Here"}
                </div>
            </div>
            <div className='w-full flex justify-between items-center py-2 px-8 bg-[#181C25] rounded-lg'>
                <div className='flex flex-col items-center justify-between gap-4 mb-1'>
                    <p className='font-poppins text-base text-white'>Number of tickets</p>
                    <p className='font-poppins text-lg text-white font-semibold'>0</p>
                </div>
                <div className='flex flex-col items-center justify-between gap-4 mb-1'>
                    <p className='font-poppins text-base text-white'>Total</p>
                    <p className='font-poppins text-lg text-white font-semibold'>0 EGP</p>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <button className='font-poppins text-lg w-fit font-normal px-5 rounded-lg py-1.5 text-white bg-[#D9D9D9]'>
                        Buy Now
                    </button>
                </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className='flex flex-col w-full max-w-[627px] p-0 bg-[#181C25] border-none'>
                    <div className='flex flex-col w-full max-w-[627px]'>
                        <div className='py-6 text-white font-poppins font-semibold bg-[#232834] items-center text-center rounded-t-lg'>
                            Choose one or more type of tickets
                        </div>
                        <div className='flex flex-col w-full divide-y-[1px] border-[rgba(255,255,255,0.25)]'>
                            <div className='px-6 flex justify-between items-center py-6'>
                                <p className='text-white font-poppins text-normal font-normal'>Standard Ticket</p>
                                <p className='text-white font-poppins text-normal font-light'>2,900 EGP</p>
                            </div>
                            <div className='px-6 flex justify-between items-center py-6'>
                                <p className='text-white font-poppins text-normal font-normal'>Standard Ticket</p>
                                <p className='text-white font-poppins text-normal font-light'>2,900 EGP</p>
                            </div>
                            <div className='px-6 flex justify-between items-center py-6'>
                                <p className='text-white font-poppins text-normal font-normal'>Standard Ticket</p>
                                <p className='text-white font-poppins text-normal font-light'>2,900 EGP</p>
                            </div>
                            <div className='px-6 flex justify-between items-center py-6'>
                                <p className='text-white font-poppins text-normal font-normal'>Standard Ticket</p>
                                <p className='text-white font-poppins text-normal font-light'>2,900 EGP</p>
                            </div>
                        </div>
                        <div className='py-6 text-white font-poppins font-normal bg-[#5C5C5C] items-center text-center'>
                            Add Tickets
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}