import { NextResponse } from "next/server"

export async function POST(req: Request) {
    console.log(req)
    return NextResponse.json({ message: 'Hello' })
}