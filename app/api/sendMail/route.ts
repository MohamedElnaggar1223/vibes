import nodemailer from 'nodemailer'
import puppeteer from 'puppeteer'
import chromium from 'chrome-aws-lambda'

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

    const browser = await chromium.puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
    })
    const page = await browser.newPage()

    const htmlString = `<h1>This is a Ticket Pdf for ${request.event}</h1>`

    await page.setContent(htmlString);
    // await page.goto('http://localhost:3000')
    await page.emulateMediaType('screen')

    const pdfBuffer = await page.pdf({
        format: 'a4',
        printBackground: true,
        margin: {
            top: '2cm',
            right: '2cm',
            bottom: '2cm',
            left: '2cm',
        },
    })

    await browser.close();

    const mailOptions = {
        from: 'maelnaggar1223@gmail.com',
        to: [request.email],
        subject: 'Test',
        attachments: [
            {
                filename: 'Ticket.pdf',
                content: pdfBuffer
            },
        ],
    }

    try
    {
        await transporter.sendMail(mailOptions)
    }
    catch(e: any)
    {
        console.log(e)
    }

    return Response.json({
        'test': 'test'
    })
}