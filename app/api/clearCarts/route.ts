import { initAdmin } from '@/firebase/server/config'
import { EventType } from '@/lib/types/eventTypes'
import { TicketType } from '@/lib/types/ticketTypes'
import { Timestamp } from 'firebase/firestore'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore';

export async function GET() {
    const admin = await initAdmin()
    admin.firestore().settings({ ignoreUndefinedProperties: true })
    const tenMinutesAgo = Timestamp.now().toMillis() - (2 * 60 * 1000)
    const usersRef = admin.firestore().collection('users')
    const snapshot = await usersRef
    //   .where('cart.createdAt', '<=', tenMinutesAgo)
    //   .where('cart.status', '==', 'pending')
      .get()

    const filteredUsers = snapshot.docs.filter(doc => doc.data().cart && doc.data().cart.tickets && doc.data().cart.createdAt <= tenMinutesAgo && doc.data().cart.status === 'pending')

    const ticketsIds = filteredUsers.map(doc => doc.data().cart.tickets).flat()

    const ticketsRef = admin.firestore().collection('tickets')
    const eventsRef = admin.firestore().collection('events')

    const ticketsUpdate = ticketsIds.map(async (ticketId: string) => {
        if(!ticketId) return console.error('No ticket id found')
        const ticket = (await ticketsRef.doc(ticketId).get()).data() as TicketType
        if(!ticket) return console.error('No ticket found')
        if(!ticket.eventId) return console.error('No event id found')
        const event = (await eventsRef.doc(ticket?.eventId).get()).data() as EventType

        const newEventTickets = event?.tickets.map(eventTicket => {
            const foundTicket = Object.keys(ticket.tickets).find(key => key === eventTicket.name)
            if (foundTicket) {
                eventTicket.quantity = eventTicket.quantity + ticket.tickets[foundTicket]
            }
        })

        // await eventsRef.doc(event.id).update({ tickets: newEventTickets! })
        if(!ticketId) return console.error('No event found')
        await ticketsRef.doc(ticketId).delete()
    })

    await Promise.all(ticketsUpdate)

    filteredUsers.forEach(doc => {
        if(!doc.id) return console.error('No user id found')
        const userRef = usersRef.doc(doc.id!)
        admin.firestore().batch().update(userRef!, { cart: { tickets: [], createdAt: FieldValue.delete() }})
    })

    revalidatePath('/cart')

    return NextResponse.json({ ok: true })
}