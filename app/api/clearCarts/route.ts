import { initAdmin } from '@/firebase/server/config'
import { EventType } from '@/lib/types/eventTypes'
import { TicketType } from '@/lib/types/ticketTypes'
import { deleteField, Timestamp } from 'firebase/firestore'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
    const admin = await initAdmin()
    const tenMinutesAgo = Timestamp.now().toMillis() - (10 * 60 * 1000)
    const usersRef = admin.firestore().collection('users')
    const snapshot = await usersRef
      .where('cart.createdAt', '<=', tenMinutesAgo)
      .where('cart.status', '==', 'pending')
      .get()

    const ticketsIds = snapshot.docs.map(doc => doc.data().cart.tickets).flat()

    const ticketsRef = admin.firestore().collection('tickets')
    const eventsRef = admin.firestore().collection('events')

    const ticketsUpdate = ticketsIds.map(async ticketId => {
        const ticket = (await ticketsRef.doc(ticketId).get()).data() as TicketType
        const event = (await eventsRef.doc(ticket?.eventId).get()).data() as EventType

        const newEventTickets = event?.tickets.map(eventTicket => {
            const foundTicket = Object.keys(ticket.tickets).find(key => key === eventTicket.name)
            if (foundTicket) {
                eventTicket.quantity = eventTicket.quantity + ticket.tickets[foundTicket]
            }
        })

        await eventsRef.doc(event.id).update({ tickets: newEventTickets })
        await ticketsRef.doc(ticketId).delete()
    })

    await Promise.all(ticketsUpdate)

    snapshot.forEach(doc => {
        const userRef = usersRef.doc(doc.id)
        admin.firestore().batch().update(userRef, {'cart.tickets': [], 'cart.createdAt': deleteField()})
    })

    revalidatePath('/cart')

    return NextResponse.json({ ok: true })
}