import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DigitalProduct as DigitalProductType } from "@/lib/types/digitalProductTypes";
import { UserType } from "@/lib/types/userTypes";
import { cn } from "@/lib/utils";
import { MapPinIcon } from "lucide-react";
import PurchaseDigitalProductReservation from "./purchase-digital-products";

export default async function DigitalProduct({ locale, digitalProduct, user, buy }: { locale: string | undefined, digitalProduct: DigitalProductType, user: UserType, buy: boolean })
{
    console.log(buy)
    return (
        <AccordionItem className="!border-none max-w-[960px] mx-auto" value={digitalProduct.id}>
            <AccordionTrigger className='w-full bg-[#EAEAEA] rounded-[12px]'>
                <div className="flex items-center justify-between min-w-[98%] border-none px-6">
                    <div className='flex flex-col gap-2 items-start justify-center'>
                        <p className='text-lg text-black font-semibold font-poppins'>{digitalProduct.title}</p>
                        <p className='text-sm text-black font-normal font-poppins flex items-center justify-center gap-1'>
                            Category: {digitalProduct.itemCategory}
                        </p>
                    </div>
                    <div className='flex flex-col gap-2 items-start justify-center'>
                        <p className='text-sm text-black font-normal font-poppins'>Seller's Role: {digitalProduct.role}</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className='max-w-full flex flex-col gap-2 max-h-[325px] overflow-auto'>
                <div className='flex items-center flex-col gap-6 justify-between border-none bg-[#EAEAEA] px-6 py-4'>
                <div className="flex flex-col gap-1 items-start justify-center w-full">
                        <p>Transaction Title</p>
                        <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                            {/* <div className='flex gap-2 items-center justify-center'>
                                <div className={cn('w-6 h-6 rounded-full', digitalProduct.status === 'pending' ? 'bg-[#D9D9D9]' : 'bg-gradient-to-b from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]')} />
                            </div> */}
                            {/* <div className='flex gap-2 items-center'>
                                <div className='p-1 bg-[#55555580] rounded-[4px] flex items-center justify-center text-center'>
                                    <input autoFocus={false} value={price} onChange={(e) => (/^-?\d*\.?\d+$/.test(e.target.value) || e.target.value === '') ? setPrice(e.target.value) : setPrice(prev => prev)} placeholder="0.00" className='text-center text-white font-poppins text-sm font-normal bg-transparent outline-none w-[3.5rem]' />
                                    <p className='font-medium text-sm font-poppins text-white'>{digitalProduct.country}</p>
                                </div>
                                {(typeof price === 'string' ? parseFloat(price) : price) !== digitalProduct.price && <div className='cursor-pointer rounded-full w-5 h-5 bg-white flex items-center justify-center' onClick={() => handleUpdatePrice(typeof price === 'string' ? parseFloat(price) : price!)}><Check size={16} /></div>}
                            </div> */}
                            
                            {/* {digitalProduct.status === 'sold' && <p className='text-xs font-medium font-poppins text-[#FF0000]'>Sold</p>} */}
                            {/* {(digitalProduct.status !== 'sold') && <p className='text-xs font-medium font-poppins text-[#ff0000]'>Event Ended</p>} */}
                            {digitalProduct.title}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-start justify-center w-full">
                        <p>Role</p>
                        <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                            {digitalProduct.role}
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 w-full">
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                            <p>Item Name</p>
                            <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                                {digitalProduct.itemName}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                            <p>Item Category</p>
                            <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                                {digitalProduct.itemCategory}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 w-full">
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                            <p>Price</p>
                            <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                                {digitalProduct.price} {digitalProduct.currency}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                            <p>Inspection Period</p>
                            <div className={cn('flex gap-2 w-full items-center justify-between bg-black px-4 py-2 text-white')}>
                                {digitalProduct.inspectionPeriod ?? 0}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-start justify-center w-full">
                        <p>Item Description</p>
                        <div className={cn('flex gap-2 w-full min-h-[53px] items-center justify-between bg-black px-4 py-2 text-white')}>
                            {digitalProduct.itemDescription}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-start justify-center w-full">
                        <p>Notes</p>
                        <div className={cn('flex gap-2 w-full min-h-[53px] items-center justify-between bg-black px-4 py-2 text-white')}>
                            {digitalProduct.notes}
                        </div>
                    </div>
                    {buy && <PurchaseDigitalProductReservation user={user!} digitalProduct={digitalProduct} />}
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}