import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Hotel } from "@/lib/types/hotelTypes";
import { UserType } from "@/lib/types/userTypes";
import { cn } from "@/lib/utils";
import { MapPinIcon } from "lucide-react";
import PurchaseHotelReservation from "./purchase-hotel-reservation";

export default async function HotelReservation({ locale, hotel, user }: { locale: string | undefined, hotel: Hotel, user: UserType })
{
    return (
        <AccordionItem className="!border-none max-w-[960px] mx-auto" value={hotel.id}>
            <AccordionTrigger className='w-full bg-[#EAEAEA] rounded-[12px]'>
                <div className="flex items-center justify-between min-w-[98%] border-none px-6">
                    <div className='flex flex-col gap-2 items-start justify-center'>
                        <p className='text-lg text-black font-semibold font-poppins'>{hotel.name}</p>
                        <p className='text-sm text-black font-normal font-poppins flex items-center justify-center gap-1'>
                            <MapPinIcon />
                            {hotel.address}
                        </p>
                    </div>
                    <div className='flex flex-col gap-2 items-start justify-center'>
                        <p className='text-sm text-black font-normal font-poppins'>Room Type: {hotel.roomType}</p>
                        <p className='text-sm text-black font-normal font-poppins'>Board Type: {hotel.boardType}</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className='max-w-full flex flex-col gap-2 max-h-[325px] overflow-auto'>
                <div className='flex items-center flex-col gap-6 justify-between border-none bg-[#EAEAEA] px-6 py-4'>
                    <div className="flex flex-col gap-1 items-start justify-center w-full">
                        <p>Hotel Detailed Address & Zip Code</p>
                        <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                            {/* <div className='flex gap-2 items-center justify-center'>
                                <div className={cn('w-6 h-6 rounded-full', hotel.status === 'pending' ? 'bg-[#D9D9D9]' : 'bg-gradient-to-b from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]')} />
                            </div> */}
                            {/* <div className='flex gap-2 items-center'>
                                <div className='p-1 bg-[#55555580] rounded-[4px] flex items-center justify-center text-center'>
                                    <input autoFocus={false} value={price} onChange={(e) => (/^-?\d*\.?\d+$/.test(e.target.value) || e.target.value === '') ? setPrice(e.target.value) : setPrice(prev => prev)} placeholder="0.00" className='text-center text-white font-poppins text-sm font-normal bg-transparent outline-none w-[3.5rem]' />
                                    <p className='font-medium text-sm font-poppins text-white'>{hotel.country}</p>
                                </div>
                                {(typeof price === 'string' ? parseFloat(price) : price) !== hotel.price && <div className='cursor-pointer rounded-full w-5 h-5 bg-white flex items-center justify-center' onClick={() => handleUpdatePrice(typeof price === 'string' ? parseFloat(price) : price!)}><Check size={16} /></div>}
                            </div> */}
                            
                            {/* {hotel.status === 'sold' && <p className='text-xs font-medium font-poppins text-[#FF0000]'>Sold</p>} */}
                            {/* {(hotel.status !== 'sold') && <p className='text-xs font-medium font-poppins text-[#ff0000]'>Event Ended</p>} */}
                            {hotel.address} - {hotel.zipCode}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-start justify-center w-full">
                        <p>Full Name</p>
                        <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                            {hotel.fullName}
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 w-full">
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                            <p>Phone Number</p>
                            <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                                {hotel.countryCode} {hotel.phoneNumber}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                            <p>Email</p>
                            <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                                {hotel.email}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-start justify-center w-full">
                        <p>Booking Platform</p>
                        <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                            {hotel.name} {hotel.website && `/ ${hotel.website}`}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-start justify-center w-full">
                        <p>Room Type</p>
                        <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                            {hotel.roomType}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-start justify-center w-full">
                        <p>Board Type</p>
                        <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                            {hotel.boardType}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-start justify-center w-full">
                        <p>Check In - Check Out</p>
                        <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                            {hotel.date.from.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}).replace(/(\d+)/, '$1')} - {hotel.date.to.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}).replace(/(\d+)/, '$1')}
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 w-full">
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                            <p>Adults</p>
                            <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                                {hotel.adults}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                            <p>Children</p>
                            <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                                {hotel.children ?? 0}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 w-full">
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                            <p>Itenirary Number</p>
                            <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                                {hotel.itineraryNumber}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                            <p>Price</p>
                            <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                                {hotel.price ?? 0} {hotel.country}
                            </div>
                        </div>
                    </div>
                    <PurchaseHotelReservation user={user!} hotel={hotel} />
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}