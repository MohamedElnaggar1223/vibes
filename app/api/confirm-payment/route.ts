import { initAdmin } from "@/firebase/server/config"
import { ExchangeRate } from "@/lib/types/eventTypes"
import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { NextResponse } from "next/server"
import { createHmac } from 'node:crypto'

export async function POST(req: Request) {
    try
    {
        const { obj: query } = await req.json()
        const hmac = req.url.replace('https://www.vibes-events.com/api/confirm-payment?hmac=', '')

        const hmacRequiredFields = [
            'amount_cents',
            'created_at',
            'currency',
            'error_occured',
            'has_parent_transaction',
            'id',
            'integration_id',
            'is_3d_secure',
            'is_auth',
            'is_capture',
            'is_refunded',
            'is_standalone_payment',
            'is_voided',
            'order.id',
            'owner',
            'pending',
            'source_data.pan',
            'source_data.sub_type',
            'source_data.type',
            'success'
        ]

        let hmacData = ''

        hmacRequiredFields.forEach(field => {
            if(field === 'order.id') {
                hmacData += query.order.id
                return
            }
            if(field === 'source_data.pan') {
                hmacData += query.source_data.pan
                return
            }
            if(field === 'source_data.sub_type') {
                hmacData += query.source_data.sub_type
                return
            }
            if(field === 'source_data.type') {
                hmacData += query.source_data.type
                return
            }
            hmacData += query[field]
        })

        const hmacCalculated = createHmac('sha512', process.env.PAYMOB_HMAC!).update(hmacData).digest('hex')

        if(hmacCalculated !== hmac) return NextResponse.json({ error: 'HMAC mismatch' }, { status: 400 })
    
        const admin = await initAdmin()
    
        const exchangeRate = await admin.firestore().collection('rates').get().then(doc => doc.docs[0].data()) as ExchangeRate

        const amountInUSD = query.currency === 'EGP' ? ((parseInt(query.amount_cents) / 100) / exchangeRate.USDToEGP) : query.currency === 'AED' ? (parseInt(query.amount_cents) / 100) / exchangeRate.USDToAED : (parseInt(query.amount_cents) / 100) / exchangeRate.USDToSAR
        const totalTicketsSold = query.order.items.filter((item: any) => item.name !== 'Parking Pass').length
        const totalItemsSold = query.order.items.length

        const userId = query.order.items[0].name.split('-')[1]
        const promoCode = query.order.items[0].name.split('-').length > 2 ? query.order.items[0].name.split('-')[2] : undefined

        const ticketsIds = query.order.items.filter((item: any) => item.name !== 'Parking Pass').map((item: any) => item.name.split('-')[0])

        await admin.firestore().runTransaction(async transaction => {
            const salesDoc = await transaction.get(admin.firestore().collection('sales').doc(process.env.NEXT_PUBLIC_SALES_ID!))

            if(promoCode) {
                const promoCodesDoc = await transaction.get(admin.firestore().collection('promoCodes').doc(promoCode))
                if(promoCodesDoc.data()?.quantity === 1) await transaction.delete(promoCodesDoc.ref)
                else await transaction.update(promoCodesDoc.ref, { quantity: promoCodesDoc.data()?.quantity - 1 })
            }

            await transaction.update(admin.firestore().collection('users').doc(userId), { tickets: FieldValue.arrayUnion(...ticketsIds), cart: { tickets: [], createdAt: null, status: 'pending' } })
            await transaction.update(salesDoc.ref, { totalRevenue: salesDoc.data()?.totalRevenue + amountInUSD, totalTicketsSold: salesDoc.data()?.totalTicketsSold + totalTicketsSold, totalSales: salesDoc.data()?.totalSales + totalItemsSold, updatedAt: Timestamp.now() })
        
            const ticketsUpdate = ticketsIds.map(async (ticketId: string) => await transaction.update(admin.firestore().collection('tickets').doc(ticketId), { status: 'paid' }))
        
            await Promise.all(ticketsUpdate)
        })
    }
    catch(e)
    {
      //console.log(e)  
    }

    return NextResponse.redirect('https://vibes-2yce-git-paymob-mohamedelnaggar1223s-projects.vercel.app/')
}