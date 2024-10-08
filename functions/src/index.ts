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

// const transporter = nodemailer.createTransport({
//     host: 'smtp-relay.brevo.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: '7b1b8d001@smtp-brevo.com',
//         pass: 'CjWRNKk6ya8bDLxn', 
//     }
// })
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: functions.config().api.gmail_mail,
        pass: functions.config().api.gmail_pass, 
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

        const newEventSeats = {...event?.seatPattern, ...ticket.seats}

        console.log(newEventTickets)

        await eventsRef.doc(event.id).update({ tickets: newEventTickets!, seatPattern: newEventSeats! })
        if(!ticketId) return console.error('No event found')
        await ticketsRef.doc(ticketId).delete()
    })

    await Promise.all(ticketsUpdate)

    const usersUpdate = filteredUsers.map(async (doc: any) => {
        if(!doc.id) return console.error('No user id found')
        await usersRef.doc(doc.id).update({ cart: { tickets: [], createdAt: null }})
    })

    await Promise.all(usersUpdate)

    fetch('https://www.whim-zee.com/api/refreshCart')

})

export const sendPdfs = functions.runWith({ memory: '1GB', timeoutSeconds: 300 }).firestore.document('tickets/{documentId}').onUpdate(async (snap, context) => {
    const ticket = {...snap.after.data(), id: snap.after.id} as TicketType

    console.log(functions.config().api.gmail_mail)
    console.log(functions.config().api.gmail_pass)

    if(ticket.status !== 'paid' || ticket.sentMail) return

    const event = await db.collection('events').doc(ticket.eventId).get()

    if(event?.exists)
    {
        const eventData = event?.data() as EventType
        const user = (await db.collection('users').doc(ticket?.userId).get()).data() as UserType
        let attachments = [] as any

        if(!eventData?.uploadedTickets)
        {

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
                if(ticket.parkingPass > 0)
                {
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
                }
            })

            await Promise.all(parkingPassPdf!)            
            await Promise.all(ticketsPdfs! ?? [])
        
        
            const mailOptions = {
                from: 'Whim Zee',
                to: [user?.email],
                subject: `Whim Zee ${eventData?.name}`,
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

                console.log(functions.config().api.key)

                // const res = await fetch('https://api.brevo.com/v3/smtp/email', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'api-key': functions.config().api.key,
                //         'content-Type': 'application/json',
                //         'accept': 'application/json',
                //         'Accpet': 'application/json'
                //     },
                //     body: JSON.stringify({
                //         "sender": {
                //             "name": "Whim Zee",
                //             "email": "7b1b8d001@smtp-brevo.com",
                //         },
                //         "to": newMailOptions.to.map(to => ({ "email": to, "name": "Whim Zee" })),
                //         "subject": newMailOptions.subject,
                //         "htmlContent": newMailOptions.html,
                //         "attachments": newMailOptions.attachments
                //     })
                // })

                // const dataFetch = await res.json()

                // console.log(dataFetch)
                
                await admin.firestore().collection('tickets').doc(ticket.id).update({ sentMail: true })
            }
            catch(e: any)
            {
                console.log(e)
            }
        }
        else if(eventData?.seated) {
            const seats = ticket.seats as { [key: string]: string }

            const seatsPdfs = Object.values(seats).map(async (seat: string, index: number) => {
                const pdfDownload = await admin.storage().bucket().file(seat).download()

                console.log(`Downloaded PDF size: ${pdfDownload[0].length} bytes`);
                console.log(`PDF snippet: ${pdfDownload[0].slice(0, 600)}`);

                attachments.push({
                    filename: `${eventData?.name} - ${index}.pdf`,
                    content: pdfDownload[0],
                    contentType: 'application/pdf'
                })

                await admin.storage().bucket().file(seat).delete()
            })

            await Promise.all(seatsPdfs!) 

            const mailOptions = {
                from: 'Whim Zee',
                to: [user?.email],
                subject: `Whim Zee ${eventData?.name}`,
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
                // const res = await fetch('https://api.brevo.com/v3/smtp/email', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'api-key': functions.config().api.key,
                //         'content-Type': 'application/json',
                //         'accept': 'application/json',
                //         'Accpet': 'application/json'
                //     },
                //     body: JSON.stringify({
                //         "sender": {
                //             "name": "Whim Zee",
                //             "email": "7b1b8d001@smtp-brevo.com",
                //         },
                //         "to": newMailOptions.to.map(to => ({ "email": to, "name": "Whim Zee" })),
                //         "subject": newMailOptions.subject,
                //         "htmlContent": newMailOptions.html,
                //         "attachments": newMailOptions.attachments
                //     })
                // })

                // const dataFetch = await res.json()

                // console.log(dataFetch)
                await admin.firestore().collection('tickets').doc(ticket.id).update({ sentMail: true })
            }
            catch(e: any)
            {
                console.log(e)
            }
        }
        else {
            const pdfs = Object.values(ticket.tickets).map(async (ticketQuantity, index) => {

                if((ticketQuantity as number) > 0)
                {
                    console.log(ticket.tickets)
    
                    const dirRef = await admin.storage().bucket().getFiles()
                    const ticketsFiles = dirRef[0].slice().filter((file: File) => file.name.includes(`${eventData.ticketFilesPath}/${Object.keys(ticket.tickets)[index]}`))
    
                    console.log(`${eventData.ticketFilesPath}/${Object.keys(ticket.tickets)[index]}`)
                    dirRef[0].forEach((file: File) => console.log(file.name))
    
                    for(let i = 0; i < (ticketQuantity as number); i++) 
                    {
                        const pdfData = await ticketsFiles[i].download()
                        attachments.push({
                            filename: `${Object.keys(ticket.tickets)[index]}`,
                            content: pdfData[0],
                            contentType: 'application/pdf'
                        })
                        await ticketsFiles[i].delete()
                    }
        
                }
            })
        
            await Promise.all(pdfs)
        
            const mailOptions = {
                from: 'Whim Zee',
                to: [user?.email],
                subject: `Whim Zee ${eventData.name}`,
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

                console.log(functions.config().api.key)

                await transporter.sendMail(newMailOptions)
                // const res = await fetch('https://api.brevo.com/v3/smtp/email', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'api-key': functions.config().api.key,
                //         'content-Type': 'application/json',
                //         'accept': 'application/json',
                //         'Accpet': 'application/json'
                //     },
                //     body: JSON.stringify({
                //         "sender": {
                //             "name": "Whim Zee",
                //             "email": "7b1b8d001@smtp-brevo.com",
                //         },
                //         "to": newMailOptions.to.map(to => ({ "email": to, "name": "Whim Zee" })),
                //         "subject": newMailOptions.subject,
                //         "htmlContent": newMailOptions.html,
                //         "attachments": newMailOptions.attachments
                //     })
                // })

                // const dataFetch = await res.json()

                // console.log(dataFetch)
                await admin.firestore().collection('tickets').doc(ticket.id).update({ sentMail: true })
            }
            catch(e: any)
            {
                console.log(e)
            }

            // await fetch(process.env.NODE_ENV === 'production' ? 'https://vibes-woad.vercel.app/api/sendPdfs' : 'http://localhost:3000/api/sendPdfs', {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         "email": user?.email,
            //         "event": event,
            //         "purchasedTickets": purchasedTickets,
            //     })
            // })
        }
    }
})