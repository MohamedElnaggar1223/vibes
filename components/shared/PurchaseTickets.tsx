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
import { cn } from "@/lib/utils"

export default function PurchaseTickets() 
{
    const [dialogOpen, setDialogOpen] = useState(false)
    const [purchasedTickets, setPurchasedTickets] = useState({ 'Standard Ticket': 0, 'Standard Plus': 0, 'VIP Standing': 0, 'VIP Premium': 0, })

    return (
        <div className='relative flex-1 flex flex-col py-2 px-2 gap-6 max-lg:w-full'>
            <div className='w-full flex justify-between items-center gap-4'>
                <div className='flex-1' />
                <div className='flex-1 flex items-center justify-center'>
                    <button onClick={() => setDialogOpen(true)} className='text-white font-poppins font-semibold text-sm py-5 px-8 bg-[#232834] rounded-lg'>
                        Choose Your Tickets
                    </button>
                </div>
                <div className='flex-1 flex items-center justify-end'>
                    <button className='text-white font-poppins font-semibold text-sm py-5 px-8 bg-[#232834] rounded-lg'>
                        Map
                    </button>
                </div>
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
                            <div className='px-6 flex justify-between items-center py-6 cursor-pointer hover:bg-[#13161d]' onClick={() => setPurchasedTickets(prev => ({...prev, 'Standard Ticket': prev['Standard Ticket'] + 1}))}>
                                <p className='text-white font-poppins text-normal font-normal flex-1'>Standard Ticket</p>
                                {
                                    purchasedTickets['Standard Ticket'] > 0 && (
                                        <div className='flex justify-center items-center flex-1 gap-2'>
                                            <button 
                                                className='bg-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setPurchasedTickets(prev => ({...prev, 'Standard Ticket': prev['Standard Ticket'] - 1}))}
                                                }
                                            >
                                                -
                                            </button>
                                            <p className='text-white font-poppins text-sm font-semibold'>{purchasedTickets['Standard Ticket']}</p>
                                            <button 
                                                className='bg-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setPurchasedTickets(prev => ({...prev, 'Standard Ticket': prev['Standard Ticket'] + 1}))}
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    )
                                }
                                <p className='text-white font-poppins text-normal font-light flex-1 text-end'>2,290 EGP</p>
                            </div>
                            <div className='px-6 flex justify-between items-center py-6 cursor-pointer hover:bg-[#13161d]' onClick={() => setPurchasedTickets(prev => ({...prev, 'Standard Plus': prev['Standard Plus'] + 1}))}>
                                <p className='text-white font-poppins text-normal font-normal flex-1'>Standard Plus</p>
                                {
                                    purchasedTickets['Standard Plus'] > 0 && (
                                        <div className='flex justify-center items-center flex-1 gap-2'>
                                            <button 
                                                className='bg-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setPurchasedTickets(prev => ({...prev, 'Standard Plus': prev['Standard Plus'] - 1}))}
                                                }
                                            >
                                                -
                                            </button>
                                            <p className='text-white font-poppins text-sm font-semibold'>{purchasedTickets['Standard Plus']}</p>
                                            <button 
                                                className='bg-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setPurchasedTickets(prev => ({...prev, 'Standard Plus': prev['Standard Plus'] + 1}))}
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    )
                                }
                                <p className='text-white font-poppins text-normal font-light flex-1 text-end'>3,500 EGP</p>
                            </div>
                            <div className='px-6 flex justify-between items-center py-6 cursor-pointer hover:bg-[#13161d]' onClick={() => setPurchasedTickets(prev => ({...prev, 'VIP Standing': prev['VIP Standing'] + 1}))}>
                                <p className='text-white font-poppins text-normal font-normal flex-1'>VIP Standing</p>
                                {
                                    purchasedTickets['VIP Standing'] > 0 && (
                                        <div className='flex justify-center items-center flex-1 gap-2'>
                                            <button 
                                                className='bg-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setPurchasedTickets(prev => ({...prev, 'VIP Standing': prev['VIP Standing'] - 1}))}
                                                }
                                            >
                                                -
                                            </button>
                                            <p className='text-white font-poppins text-sm font-semibold'>{purchasedTickets['VIP Standing']}</p>
                                            <button 
                                                className='bg-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setPurchasedTickets(prev => ({...prev, 'VIP Standing': prev['VIP Standing'] + 1}))}
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    )
                                }
                                <p className='text-white font-poppins text-normal font-light flex-1 text-end'>5,500 EGP</p>
                            </div>
                            <div className='px-6 flex justify-between items-center py-6 cursor-pointer hover:bg-[#13161d]' onClick={() => setPurchasedTickets(prev => ({...prev, 'VIP Premium': prev['VIP Premium'] + 1}))}>
                                <p className='text-white font-poppins text-normal font-normal flex-1'>VIP Premium</p>
                                {
                                    purchasedTickets['VIP Premium'] > 0 && (
                                        <div className='flex justify-center items-center flex-1 gap-2'>
                                            <button 
                                                className='bg-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setPurchasedTickets(prev => ({...prev, 'VIP Premium': prev['VIP Premium'] - 1}))}
                                                }
                                            >
                                                -
                                            </button>
                                            <p className='text-white font-poppins text-sm font-semibold'>{purchasedTickets['VIP Premium']}</p>
                                            <button 
                                                className='bg-white text-base font-poppins font-medium h-5 w-5 rounded-full text-center flex items-center justify-center' 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setPurchasedTickets(prev => ({...prev, 'VIP Premium': prev['VIP Premium'] + 1}))}
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    )
                                }
                                <p className='text-white font-poppins text-normal font-light flex-1 text-end'>8,000 EGP</p>
                            </div>
                        </div>
                        <div className={cn('py-6 text-white font-poppins font-normal bg-[#5C5C5C] items-center text-center cursor-pointer', Object.values(purchasedTickets).find(ticket => ticket > 0) && 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]')}>
                            Add Tickets
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}