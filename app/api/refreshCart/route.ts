import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
    revalidatePath('/cart')
    return NextResponse.json({ ok: true })
}