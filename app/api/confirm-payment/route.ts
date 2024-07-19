import { initAdmin } from "@/firebase/server/config"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try
    {
        const query = await req.json()
    
        const admin = await initAdmin()
    
        await admin.firestore().collection('payments').add({
            success: query.success,
        })
    }
    catch(e)
    {
        
    }

    return NextResponse.redirect('https://vibes-2yce-git-paymob-mohamedelnaggar1223s-projects.vercel.app/')
}

export async function GET() {
    return NextResponse.redirect('https://vibes-2yce-git-paymob-mohamedelnaggar1223s-projects.vercel.app/')
}