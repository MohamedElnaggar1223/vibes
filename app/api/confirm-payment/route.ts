import { initAdmin } from "@/firebase/server/config"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try
    {
        const query = await req.json()
        const params = req.url
        const data = req.body
    
        const admin = await initAdmin()
    
        await admin.firestore().collection('payments').add({
            ...query,
            params,
            ...data,
        })
    }
    catch(e)
    {
      //console.log(e)  
    }

    return NextResponse.redirect('https://vibes-2yce-git-paymob-mohamedelnaggar1223s-projects.vercel.app/')
}