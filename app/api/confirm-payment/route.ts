import { NextResponse } from "next/server"

export async function GET(req: Request) {
    console.log(req)

    return NextResponse.redirect('/')
}