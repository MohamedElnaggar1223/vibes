import Image from "next/image";
import Link from "next/link";
import { getUser } from "../layout";
import { cn, getCart, getEvent, getExchangeRate } from "@/lib/utils";
import CartTimer from "@/components/shared/CartTimer";
import CartTicket from "@/components/shared/CartTicket";
import { revalidatePath } from "next/cache";

export default async function Cart()
{
    revalidatePath('/cart')
    const user = await getUser()
    const cart = await getCart(user?.id!)

    if(cart.tickets.length === 0)
    {
        return (
            <section className='h-[80vh] w-full flex flex-col gap-2 items-center justify-center'>
                <div className='relative flex'>
                    <Image
                        src='/assets/ghost.svg'
                        width={200}
                        height={105}
                        alt='ghost' 
                        className="z-20"
                    />
                    <div className='absolute z-10 rounded-full w-32 h-32 bg-white opacity-20 top-6 right-10' />
                </div>
                <p className='text-white font-poppins text-xl font-light -mt-6'>No Items in Bag...</p>
                <p className='text-white font-poppins text-xl font-light mt-3 profile-span'>Browse <Link href='/'><span className='underline decoration-[rgba(231,35,119,1)] underline-offset-4'>Events & Tickets</span></Link></p>
            </section>
        )
    }

    const uniqueEvents = cart.tickets.reduce((events, ticket) => {
        if(!events.includes(ticket.eventId)) events.push(ticket.eventId)
        return events
    }, [] as string[])

    const eventsData = uniqueEvents.map(async eventId => {
        const event = await getEvent(eventId)
        return event
    })

    const events = await Promise.all(eventsData)

    const exchangeRate = await getExchangeRate()

    return (
        <section className='h-[90vh] w-full flex flex-col gap-2 items-center justify-center'>
            <div className='w-screen max-w-[734px] flex flex-col'>
                <div className='flex items-center justify-between gap-2'>
                    <p className='font-poppins text-white font-medium text-lg'>Reserved Tickets</p>
                    <div className='flex gap-1.5 items-center'>
                        <p className='font-poppins text-white font-thin text-base'>Tickets Reserved for</p>
                        <CartTimer createdAt={cart?.createdAt!} />
                    </div>
                </div>
                <div className='w-full rounded-sm bg-[rgba(217,217,217,0.2)] flex flex-col gap-4 h-screen max-h-[524px] overflow-auto'>
                    {cart.tickets.map(ticket => (
                        <CartTicket key={ticket.id} ticket={ticket} event={events.find(event => event?.id === ticket.eventId)!} exchangeRate={exchangeRate} />
                    ))}
                </div>
            </div>
            <Link href='/cart/checkout' className='w-full max-w-[412px]'>
                <button className={cn('cursor-pointer max-w-[412px] mt-4 bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] rounded-md font-light py-5 px-10 w-full text-white font-poppins')}>Checkout</button>
            </Link>
        </section>
    )
}