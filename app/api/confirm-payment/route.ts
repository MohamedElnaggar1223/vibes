import { NextResponse } from "next/server"

export async function GET(req: Request) {
    console.log(req)

    return NextResponse.redirect('https://vibes-2yce-git-paymob-mohamedelnaggar1223s-projects.vercel.app/')
}