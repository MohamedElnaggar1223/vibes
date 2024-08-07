import { PromoCode } from "@/lib/types/ticketTypes"
import { NextResponse } from "next/server"

type RequestType = { 
    amount_cents: string, 
    currency: string, 
    items: { name: string, amount: string, quantity: string }[],
    user: { first_name: string, last_name: string, email: string, phone_number: string }
    promoCode: PromoCode | undefined
}

export async function POST(req: Request) {
    const { amount_cents, currency, items, user } = await req.json() as RequestType

    if(!amount_cents || !currency || !items || !user) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    console.log(amount_cents, currency, items, user)

    try
    {
        
        // const tokenRequest = await fetch('https://accept.paymob.com/api/auth/tokens', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         api_key: process.env.PAYMOB_API_KEY
        //     })
        // }).then(res => res.json()) as { token: string }

        // const orderRequest = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         auth_token: tokenRequest.token,
        //         delivery_needed: 'false',
        //         amount_cents,
        //         currency,
        //         items,
        //     })
        // }).then(res => res.json()) as { id: number }

        // const paymentKeyRequest = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         auth_token: tokenRequest.token,
        //         amount_cents,
        //         currency,
        //         order_id: orderRequest.id.toString(),
        //         billing_data: {
        //             first_name: user.first_name,
        //             last_name: user.last_name,
        //             email: user.email,
        //             phone_number: user.phone_number,
        //             street: 'NA',
        //             building: 'NA',
        //             floor: 'NA',
        //             apartment: 'NA',
        //             city: 'NA',
        //             country: 'NA'
        //         },
        //         integration_id: process.env.PAYMOB_INTEGRATION_ID,
        //         expiration: 3600
        //     })
        // }).then(res => res.json()) as { token: string }

        const newItems = items.map(item => ({ amount: parseFloat(item.amount), name: item.name, quantity: parseInt(item.quantity) }))

        const intentionInitiationRequest = await fetch('https://accept.paymob.com/v1/intention/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${process.env.PAYMOB_SECRET_KEY}`,
            },
            body: JSON.stringify({
                "amount": parseFloat(amount_cents),
                "currency": currency,
                "payment_methods": [
                    process.env.PAYMOB_INTEGRATION_ID,
                    "card",
                    "you can add Integration id directly or your integration name"
                ],
                "integrations": [
                    process.env.PAYMOB_INTEGRATION_ID
                ],
                "items": newItems,
                "billing_data": {
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "street": 'NA',
                    "building": 'NA',
                    "country": 'NA',
                    "apartment": 'NA',
                    "floor": 'NA',
                    "state": 'NA'
                },
                "customer": {
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                },
            })
        }).then(res => res.json()) as { client_secret: string }

        console.log(intentionInitiationRequest)

        return NextResponse.json({redirect: `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${intentionInitiationRequest.client_secret}`})
    }
    catch(e)
    {
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 })
    }

}