import { initAdmin } from "@/firebase/server/config"
import { EventType, ExchangeRate } from "@/lib/types/eventTypes"
import { Hotel } from "@/lib/types/hotelTypes"
import { Bundle, TicketType } from "@/lib/types/ticketTypes"
import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { NextResponse } from "next/server"
import { createHmac } from 'node:crypto'

export async function POST(req: Request) {
    try
    {
        const { obj: query } = await req.json()
        console.log(req.url)
        const hmac = req.url.replace('https://www.vibes-events.com/api/confirm-payment?hmac=', '')

        console.log(query)

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

        if(query.success == false) return NextResponse.redirect('https://www.whim-zee.com/')

        const admin = await initAdmin()

        const exchangeRate = await admin.firestore().collection('rates').get().then(doc => doc.docs[0].data()) as ExchangeRate

        const amountInUSD = query.currency === 'EGP' ? ((parseInt(query.amount_cents) / 100) / exchangeRate.USDToEGP) : query.currency === 'AED' ? (parseInt(query.amount_cents) / 100) / exchangeRate.USDToAED : (parseInt(query.amount_cents) / 100) / exchangeRate.USDToSAR
        const totalTicketsSold = query.order.items.filter((item: any) => item.name !== 'Parking Pass').length
        const totalItemsSold = query.order.items.length

        const type = query.order.items[0].name.split('-')[0] === 'type'
        const userId = type ? query.order.items[0].name.split('-')[3] : query.order.items[0].name.split('-')[1]

        if(type)
        {
            await admin.firestore().runTransaction(async transaction => {
                await Promise.all(query.order.items.map(async (item: { name: string, amount: string, quantity: string, type: string, ticketId: string }) => {
                    if(item.name.split('-')[1] === 'individual')
                    {
                        const ticketDoc = (await transaction.get(admin.firestore().collection('tickets').doc(item.name.split('-')[1])))
                        const ticket = ticketDoc.data() as TicketType
                        const event = (await transaction.get(admin.firestore().collection('events').doc(ticket.eventId))).data() as EventType
        
                        if(event.uploadedTickets)
                        {
                            await transaction.update(ticketDoc.ref, { saleStatus: 'inEscrow' })
                        }
                        else
                        {
                            await transaction.update(ticketDoc.ref, { saleStatus: 'sold' })
                        }
                    }
                    else if(item.name.split('-')[1] === 'bundle')
                    {
                        const bundleDoc = (await transaction.get(admin.firestore().collection('bundles').doc(item.name.split('-')[1])))
                        const bundle = bundleDoc.data() as Bundle
                        const event = (await transaction.get(admin.firestore().collection('events').doc(bundle.eventId))).data() as EventType

                        if(event.uploadedTickets)
                        {
                            await transaction.update(bundleDoc.ref, { status: 'inEscrow' })
                        }
                        else
                        {
                            await transaction.update(bundleDoc.ref, { status: 'sold' })
                        }
                    }
                    else if(item.name.split('-')[1] === 'hotel') 
                    {
                        await transaction.update(admin.firestore().collection('hotels').doc(item.name.split('-')[1]), { status: 'sold', buyerId: userId })
                    }
                    else if(item.name.split('-')[1] === 'digitalProduct') 
                    {
                        await transaction.update(admin.firestore().collection('digitalProducts').doc(item.name.split('-')[1]), { status: 'sold', buyerId: userId })
                    }
                }))
            })
        }
        else 
        {
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
    }
    catch(e)
    {
      //console.log(e)  
    }

    return NextResponse.redirect('https://www.whim-zee.com/')
}

export async function GET(req: Request) {
    const params = req.url.includes('success=false') ? 'error' : 'success'

    if(params === 'success') {
        const admin = await initAdmin()
        
        const ticket = await admin.firestore().collection('tickets').get().then(doc => doc.docs[0].data())

        return NextResponse.redirect(`https://www.whim-zee.com/success/${ticket.id}`)
    }

    return NextResponse.redirect('https://www.whim-zee.com/')
}