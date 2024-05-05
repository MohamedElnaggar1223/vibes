import TicketEmail from '@/components/pdf/TicketEmail'
import { initAdmin } from '@/firebase/server/config'
import { EventType } from '@/lib/types/eventTypes'
import { TicketType } from '@/lib/types/ticketTypes'
import { render } from '@react-email/render'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'maelnaggar1223@gmail.com',
        pass: 'nwlb vxnh kxru hkga', 
    }
})

export async function POST(req: Request)
{
    const request = await req.json()
    const { mailOptions, event, ticket } = request

    console.log(ticket)

    const eventData = {
        ...event,
        createdAt: event?.createdAt?.toDate(),
        eventTime: event?.eventTime?.toDate(),
        eventDate: event?.eventDate?.toDate(),
        updatedAt: event?.updatedAt?.toDate(),
        gatesClose: event?.gatesClose?.toDate(),
        gatesOpen: event?.gatesOpen?.toDate(),
    } as EventType

    const ticketData = {
        ...ticket,
        createdAt: ticket?.createdAt?.toDate(),
    } as TicketType

    const emailHtml = render(<TicketEmail event={eventData} ticket={ticketData} />);

    try
    {
        await transporter.sendMail({...mailOptions, html: emailHtml})
    }
    catch(e)
    {
        console.error(e)
    }
}

export async function GET(req: Request)
{
    const admin = await initAdmin()
    const event = (await admin.firestore().collection('events').doc('04tiDD8GBBSd6lfA7kLG').get()).data()
    const ticket = (await admin.firestore().collection('tickets').doc('0604XOw9s2pQtzirGCkt').get()).data()

    const eventData = {
        ...event,
        createdAt: event?.createdAt.toDate(),
        eventTime: event?.eventTime.toDate(),
        eventDate: event?.eventDate.toDate(),
        updatedAt: event?.updatedAt?.toDate(),
        gatesClose: event?.gatesClose?.toDate(),
        gatesOpen: event?.gatesOpen?.toDate(),
    } as EventType

    const ticketData = {
        ...ticket,
        createdAt: ticket?.createdAt.toDate(),
    } as TicketType

    const emailHtml = render(<TicketEmail event={eventData} ticket={ticketData} />);

    const mailOptions = {
        from: 'Vibes',
        to: 'maelnaggar1223@gmail.com',
        subject: `Vibes ${eventData.name}`,
        html: emailHtml
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: "Okay" })
}