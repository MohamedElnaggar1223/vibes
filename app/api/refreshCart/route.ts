import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
    revalidatePath('/')
    revalidatePath('/(root)/cart', 'layout')
    revalidatePath('/(root)/cart', 'page')
    return NextResponse.json({ ok: true })
}