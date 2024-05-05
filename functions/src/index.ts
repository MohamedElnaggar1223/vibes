import { UserType } from './../../lib/types/userTypes';
import { EventType } from './../../lib/types/eventTypes';
/**
 * Import function triggers from their respective submodules:
*
* import {onCall} from "firebase-functions/v2/https";
* import {onDocumentWritten} from "firebase-functions/v2/firestore";
*
* See a full list of supported triggers at https://firebase.google.com/docs/functions
*/

import { TicketType } from './../../lib/types/ticketTypes';
import * as functions from 'firebase-functions'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { Timestamp } from 'firebase-admin/firestore';
// import * as admin from 'firebase-admin'
const admin = require('firebase-admin')
const nodemailer = require('nodemailer')
const chrome = require('@sparticuz/chromium')
const puppeteer = require('puppeteer-core')
admin.initializeApp()
const db = admin.firestore()

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

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

export const clearCarts = onSchedule("* * * * *", async () => {
    // admin.firestore().settings({ ignoreUndefinedProperties: true })
    const tenMinutesAgo = Timestamp.now().toMillis() - (10 * 60 * 1000)
    const usersRef = db.collection('users')
    const snapshot = await usersRef
    //   .where('cart.createdAt', '<=', tenMinutesAgo)
    //   .where('cart.status', '==', 'pending')
      .get()

    

    const filteredUsers = snapshot.docs.filter((doc: any) => doc.data().cart && doc.data().cart.tickets && doc.data().cart.createdAt && doc.data().cart.createdAt.toMillis() <= tenMinutesAgo && doc.data().cart.status === 'pending')
    
    const ticketsIds = filteredUsers.map((doc: any) => doc.data().cart.tickets).flat()

    const ticketsRef = db.collection('tickets')
    const eventsRef = db.collection('events')

    const ticketsUpdate = ticketsIds.map(async (ticketId: string) => {
        if(!ticketId) return console.error('No ticket id found')
        console.log(ticketId)
        const ticket = (await ticketsRef.doc(ticketId).get()).data() as TicketType
        if(!ticket) return console.error('No ticket found')
        if(!ticket.eventId) return console.error('No event id found')
        const event = (await eventsRef.doc(ticket?.eventId).get()).data() as EventType

        const newEventTickets = event?.tickets.map(eventTicket => {
            console.log(eventTicket)
            console.log(ticket.tickets)
            const foundTicket = Object.keys(ticket.tickets).find(key => key === eventTicket.name)
            if (foundTicket) {
                console.log(foundTicket)
                return {...eventTicket, quantity: eventTicket.quantity + ticket.tickets[foundTicket]}
            }
            return eventTicket
        })

        console.log(newEventTickets)

        await eventsRef.doc(event.id).update({ tickets: newEventTickets! })
        if(!ticketId) return console.error('No event found')
        await ticketsRef.doc(ticketId).delete()
    })

    await Promise.all(ticketsUpdate)

    const usersUpdate = filteredUsers.map(async (doc: any) => {
        if(!doc.id) return console.error('No user id found')
        await usersRef.doc(doc.id).update({ cart: { tickets: [], createdAt: null }})
    })

    await Promise.all(usersUpdate)

    fetch('https://www.vibes-events.com/api/refreshCart')

})

export const sendPdfs = functions.runWith({ memory: '1GB', timeoutSeconds: 300 }).firestore.document('tickets/{documentId}').onUpdate(async (snap, context) => {
    const ticket = {...snap.after.data(), id: snap.after.id} as TicketType

    if(ticket.status !== 'paid') return

    const event = await db.collection('events').doc(ticket.eventId).get()

    if(event?.exists)
    {
        const eventData = event?.data() as EventType
        if(!eventData?.uploadedTickets)
        {
            const user = (await db.collection('users').doc(ticket?.userId).get()).data() as UserType

            let attachments = [] as any

            if(!ticket.tickets) return
            
            const ticketsPdfs = Object.keys(ticket.tickets).map(async (ticketEntry: any) => {
                const noOfTickets = ticket.tickets[ticketEntry]
                for(let i = 0; i < noOfTickets; i++)
                {
                    const browser = await puppeteer.launch({
                        args: [...chrome.args, '--disable-features=site-per-process'],
                        defaultViewport: chrome.defaultViewport,
                        executablePath: await chrome.executablePath(),
                        headless: false,
                    })
        
                    const page = await browser.newPage()
        
                    console.log(ticketEntry, ' ticket id')
        
                    await page.goto(`https://vibes-woad.vercel.app/ticket/${ticket?.id}?type=${ticketEntry}`, {
                        waitUntil: 'networkidle2'
                    })
        
                    const pdfBuffer = await page.pdf({
                        format: 'A4',
                        printBackground: true,
                        margin: {
                            top: '2cm',
                            right: '2cm',
                            bottom: '2cm',
                            left: '2cm',
                        },
                    })

                    attachments.push({
                        filename: `${eventData?.name}-${ticketEntry}.pdf`,
                        content: pdfBuffer
                    })

                    await browser.close()
                }
            })

            const parkingPassPdf = [...Array(ticket.parkingPass)].map(async (_, i) => {
                const browser = await puppeteer.launch({
                    args: [...chrome.args, '--disable-features=site-per-process'],
                    defaultViewport: chrome.defaultViewport,
                    executablePath: await chrome.executablePath(),
                    headless: false,
                })
    
                const page = await browser.newPage()
    
    
                await page.goto(`https://vibes-woad.vercel.app/ticket/${ticket?.id}?type=ParkingPass`, {
                    waitUntil: 'networkidle2'
                })
    
                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    printBackground: true,
                    margin: {
                        top: '2cm',
                        right: '2cm',
                        bottom: '2cm',
                        left: '2cm',
                    },
                })

                attachments.push({
                    filename: `${eventData?.name}-ParkingPass.pdf`,
                    content: pdfBuffer
                })

                await browser.close()
            })

            await Promise.all(parkingPassPdf!)            
            await Promise.all(ticketsPdfs! ?? [])
        
        
            const mailOptions = {
                from: 'Vibes',
                to: [user?.email],
                subject: `Vibes ${eventData?.name}`,
                attachments: attachments
            }

            const postReq = {
                ticket,
                event: {...event.data(), id: event.id} 
            }
        
            try
            {
                const data = await fetch('https://www.vibes-events.com/api/sendTicket', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postReq)
                }).then(res => res.json())

                const newMailOptions = {
                    ...mailOptions,
                    html: data.emailHtml
                }

                await transporter.sendMail(newMailOptions)
            }
            catch(e: any)
            {
                console.log(e)
            }
        }
    }
})