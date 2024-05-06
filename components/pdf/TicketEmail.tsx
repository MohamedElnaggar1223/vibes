import { months } from "../../constants";
import { EventType } from "../../lib/types/eventTypes";
import { TicketType } from "../../lib/types/ticketTypes";
import { formatTime, getDaySuffix } from "../../lib/utils";
import {
    Body,
    Column,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Tailwind,
    Font,
  } from "@react-email/components";

type Props = {
    event: EventType
    ticket: TicketType
}

export default function TicketEmail({ event, ticket }: Props)
{
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Poppins"
                    fallbackFontFamily="sans-serif"  // You can choose an appropriate fallback font
                    webFont={{
                        url: "https://fonts.gstatic.com/s/poppins/v15/pxiByp8kv8JHgFVrFJDUc1NECPY.woff2", // URL for a specific weight and style of Poppins
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>{''}</Preview>
            <Tailwind>
                <Body className='min-w-[960px] flex items-center justify-center flex-col'>
                    <Section width={960} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='min-w-[960px] border border-solid border-[#eaeaea] flex flex-col items-center justify-center px-4 py-4'>
                        <Section width={960} className='w-full max-w-[960px] flex flex-col'>
                            <Row width={960} className='w-[960px] mx-auto flex justify-between'>
                                <Column width={466} align="left" className='h-[50px] overflow-hidden '>
                                    <Img
                                        src='https://firebasestorage.googleapis.com/v0/b/test-2cf5b.appspot.com/o/play_store_512.png?alt=media&token=a5f145ce-53c4-48af-a75e-26f81067cd87'
                                        alt='logo'
                                        width='100'
                                        height='100'
                                        className='object-contain'
                                    />
                                </Column>
                                <Column width={466} align="right" className=''>
                                    <Link href="https://www.vibes-events.com/profile">My Profile</Link>
                                </Column>
                            </Row>
                        </Section>
                        <Section width={960} className='my-16 w-[960px] flex-col mx-auto flex items-center justify-center text-center'>
                            <Text className='font-poppins w-[960px] mx-auto text-7xl font-bold text-black text-center'>You Got the Tickets</Text>
                        </Section>
                        <Section width={960} className='w-[960px] flex flex-col mx-auto'>
                            <Row width={960} className='w-[960px] mx-auto flex justify-between'>
                                <Column width={466} align="center" className='h-[360px] overflow-hidden mx-4'>
                                    <Img
                                        src={event.displayPageImage}
                                        alt='logo'
                                        width='360'
                                        height='360'
                                        className='object-contain'
                                    />
                                </Column>
                                <Column width={466} style={{ marginLeft: '80px' }} align="left" className=''>
                                    <Text className='font-poppins text-3xl text-left'>{event.name}</Text>
                                    <Text className='font-poppins text-xl text-left'>{months[event.eventDate?.getMonth()]}, {getDaySuffix(event.eventDate?.getDate())}, {event.eventDate?.getFullYear()} - {formatTime(event.eventTime)}</Text>
                                    <Text className='font-poppins text-xl text-left'>{event.venue}, {event.city}, {event.country}</Text>
                                </Column>
                            </Row>
                        </Section>
                        <Section width={960} className='my-16 w-[960px] flex-col mx-auto flex items-start justify-start text-start'>
                            <Text className='font-poppins w-[960px] mx-auto text-3xl font-bold text-black text-left'>Important Information</Text>
                            {event.eventDisclaimers.map((disclaimer, index) => (
                                <Text key={index} className='font-poppins w-[960px] mx-auto text-lg text-left'>• {disclaimer.disclaimer}</Text>
                            ))}
                        </Section>
                        <Section width={960} className='w-full max-w-[960px] flex flex-col'>
                            <Row width={960} className='w-[960px] mx-auto flex justify-between'>
                                <Column width={466} align="left" className='h-[50px] overflow-hidden '>
                                    <Text className='text-3xl font-bold text-black text-left font-[Ppoppins'>Payment Summary</Text>
                                </Column>
                                <Column width={466} align="right" className=''>
                                    <Link href={`https://www.vibes-events.com/profile?show=my-tickets&id=${ticket.id}`} className='text-2xl'>View Details</Link>
                                </Column>
                            </Row>
                        </Section>
                        <Hr className='w-[720px] my-4' />
                        <Section width={780} className='my-16 w-[780px] flex-col mx-auto flex items-start justify-start text-start'>
                            <Text className='font-poppins w-[780px] mx-auto text-3xl font-bold text-black text-right'>Total: {ticket.totalPaid}{ticket.country}</Text>
                        </Section>
                        <Section width={960} className='my-16 w-[960px] flex-col mx-auto flex items-center justify-center text-center'>
                            <Text className='font-poppins w-[960px] mx-auto text-2xl font-bold text-gray-500 text-center'>Tickets Are Attached as Pdfs below</Text>
                        </Section>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}