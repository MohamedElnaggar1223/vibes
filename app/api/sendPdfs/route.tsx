import { initAdmin } from '@/firebase/server/config'
import { EventType } from '@/lib/types/eventTypes'
import { getStorage, listAll, ref, getDownloadURL, deleteObject } from 'firebase/storage'
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
    const { email, purchasedTickets, event } = request as { email: string, purchasedTickets: { [x: string]: number }, event: EventType }

    console.log(event.ticketFilesPath)

    try
    {
        let attachments = [] as any
    
        const admin = await initAdmin()
    
        const pdfs = Object.values(purchasedTickets).map(async (ticketQuantity, index) => {
            if(ticketQuantity > 0)
            {
                const dirRef = await admin.storage().bucket().getFiles()
                const ticketsFiles = dirRef[0].slice().filter(file => file.name.includes(`${event.ticketFilesPath}/${Object.keys(purchasedTickets)[index]}`))

                for(let i = 0; i < ticketQuantity; i++) 
                {
                    const pdfData = await ticketsFiles[i].download()
                    attachments.push({
                        filename: `${Object.keys(purchasedTickets)[index]}`,
                        content: pdfData[0],
                        contentType: 'application/pdf'
                    })
                    await ticketsFiles[i].delete()
                }
    
            }
        })
    
        await Promise.all(pdfs)
    
        const mailOptions = {
            from: 'Vibes',
            to: [email],
            subject: `Vibes ${event.name}`,
            attachments: attachments
        }
    
        try
        {
            await transporter.sendMail(mailOptions)
        }
        catch(e: any)
        {
            console.log(e)
        }
    }
    catch(e)
    {
        console.log(e)
    }

    return Response.json({
        'test': 'test'
    })
}