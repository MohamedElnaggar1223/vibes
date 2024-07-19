import { initAdmin } from "@/firebase/server/config"
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
            hmacData += query[field]
        })

        const hmacCalculated = createHmac('sha512', process.env.PAYMOB_HMAC!).update(hmacData).digest('hex')

        console.log(hmacCalculated)
        console.log(hmac)

        if(hmacCalculated !== hmac) return NextResponse.json({ error: 'HMAC mismatch' }, { status: 400 })
    
        const admin = await initAdmin()
    
        await admin.firestore().collection('payments').add({
            hmac,
            hmacCalculated,
            ...query,
        })
    }
    catch(e)
    {
      //console.log(e)  
    }

    return NextResponse.redirect('https://vibes-2yce-git-paymob-mohamedelnaggar1223s-projects.vercel.app/')
}