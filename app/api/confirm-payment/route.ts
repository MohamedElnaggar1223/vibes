import { initAdmin } from "@/firebase/server/config"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const admin = await initAdmin()

    admin.firestore().collection('payments').add({
        ...req
    })

    return NextResponse.redirect('https://vibes-2yce-git-paymob-mohamedelnaggar1223s-projects.vercel.app/')
}