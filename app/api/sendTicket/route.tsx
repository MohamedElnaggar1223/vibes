import TicketEmail from '@/components/pdf/TicketEmail'
import { initAdmin } from '@/firebase/server/config'
import { EventType } from '@/lib/types/eventTypes'
import { TicketType } from '@/lib/types/ticketTypes'
import { render } from '@react-email/render'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'maelnaggar1223@gmail.com',
//         pass: 'nwlb vxnh kxru hkga', 
//     }
// })

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_MAIL,
        pass: process.env.GMAIL_PASS,
    }
})

export async function POST(req: Request)
{
    const request = await req.json()
    const { event, ticket } = request

    const eventData = {
        ...event,
        createdAt: !event.createdAt ? null : new Date(event?.createdAt._seconds * 1000),
        eventTime: !event.eventTime ? null : new Date(event?.eventTime._seconds * 1000),
        eventDate: !event.eventDate ? null : new Date(event?.eventDate._seconds * 1000),
        updatedAt: !event.updatedAt ? null : new Date(event?.updatedAt._seconds * 1000),
        gatesClose: !event.gatesClose ? null : new Date(event?.gatesClose._seconds * 1000),
        gatesOpen: !event.gatesOpen ? null : new Date(event?.gatesOpen._seconds * 1000),
    } as EventType

    const ticketData = {
        ...ticket,
        createdAt: !ticket.createdAt ? null : new Date(ticket?.createdAt._seconds * 1000),
    } as TicketType

    const emailHtml = render(<TicketEmail event={eventData} ticket={ticketData} />);

    // const newMailOptions = {
    //     ...mailOptions,
    //     attachments: newAttachments,
    //     html: emailHtml
    // }

    try
    {
        // await transporter.sendMail(newMailOptions)
        return NextResponse.json({ emailHtml })
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
        eventTime: event?.eventTime?.toDate(),
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
        from: 'Whim Zee',
        to: 'maelnaggar1223@gmail.com',
        subject: `Whim Zee ${eventData.name}`,
        html: emailHtml
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: "Okay" })
}