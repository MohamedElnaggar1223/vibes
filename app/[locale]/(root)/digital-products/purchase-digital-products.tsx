'use client'

import { DigitalProduct } from "@/lib/types/digitalProductTypes"
import { UserType } from "@/lib/types/userTypes"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
    user: UserType | undefined
    digitalProduct: DigitalProduct
}

export default function PurchaseDigitalProduct({ user, digitalProduct }: Props) {
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const handleBuy = async () => {
        setLoading(true)

        const amountInCents = digitalProduct.price * 100

        const response = await fetch('/api/begin-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount_cents: amountInCents,
                currency: digitalProduct.currency,
                items: [{ type: 'digitalProduct', id: digitalProduct.id, name: `${digitalProduct.title}`, amount: digitalProduct.price * 100, quantity: 1, userId: user?.id }],
                user: { first_name: user?.firstname, last_name: user?.lastname, email: user?.email, phone_number: `${user?.countryCode}${user?.phoneNumber}`, userId: user?.id },
            })
        }).then(res => res.json())

        setLoading(false)

        router.push(response.redirect)
        // if(event.uploadedTickets) {
        //     await runTransaction(db, async (transaction) => {
        //         await Promise.all(selectedTickets.map(async (ticket) => {
        //             if(ticket.type === 'individual') {
        //                 await transaction.update(doc(db, 'tickets', ticket.id), { saleStatus: 'inEscrow', requested: true, requestStatus: 'pending' }) 
        //             }
        //             else if(ticket.type === 'bundle') {
        //                 const bundle = bundlesWithTickets.find(bundle => bundle.id === ticket.id) ?? { id: ticket.id, tickets: [] }
        //                 await Promise.all(bundle.tickets.map(async (ticket) => {
        //                     await transaction.update(doc(db, 'tickets', ticket.id), { saleStatus: 'inEscrow' })
        //                 }))
        //                 await transaction.update(doc(db, 'bundles', bundle.id), { saleStatus: 'inEscrow', requested: true, requestStatus: 'pending' })
        //             }
        //         }))
        //     })
        // }
        // else {
        //     await runTransaction(db, async (transaction) => {
        //         await Promise.all(selectedTickets.map(async (ticket) => {
        //             if(ticket.type === 'individual') {
        //                 await transaction.update(doc(db, 'tickets', ticket.id), { saleStatus: 'sold' }) 
        //             }
        //             else if(ticket.type === 'bundle') {
        //                 const bundle = bundlesWithTickets.find(bundle => bundle.id === ticket.id) ?? { id: ticket.id, tickets: [] }
        //                 await Promise.all(bundle.tickets.map(async (ticket) => {
        //                     await transaction.update(doc(db, 'tickets', ticket.id), { saleStatus: 'sold' })
        //                 }))
        //                 await transaction.update(doc(db, 'bundles', bundle.id), { saleStatus: 'sold' })
        //             }
        //         }))
        //     })
        // }
        // router.refresh()
        setLoading(false)
    }

    return (
        <button onClick={handleBuy} disabled={!user || loading} className={cn('w-full text-white font-semibold font-poppins text-sm py-4 rounded-[4px] flex items-center justify-center gap-1', (!user) ? 'bg-gray-300' : 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]')}>{loading && <Loader2 className='w-6 h-6 animate-spin' />} Book Now</button>
    )
}