'use client'
import { months } from "@/constants"
import { db } from "@/firebase/client/config"
import { initAdmin } from "@/firebase/server/config"
import { EventType } from "@/lib/types/eventTypes"
import { TicketType } from "@/lib/types/ticketTypes"
import { formatTime, getDaySuffix } from "@/lib/utils"
import { doc, getDoc } from "firebase/firestore"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"

export default function TicketPagePdf()
{	
	const params = useParams<{id: string}>()

	if(!params?.id) return null

	const [ticket, setTicket] = useState<TicketType>()
	const [event, setEvent] = useState<EventType>()

	useEffect(() => {
		const fetchTicket = async () => {
			const ticketDoc = doc(db, 'tickets', params.id)
			const ticketSnapshot = await getDoc(ticketDoc)
			setTicket({...ticketSnapshot.data(), id: ticketSnapshot.id} as TicketType)
		}

		fetchTicket()
	}, [])

	useEffect(() => {
		const fetchEvent = async () => {
			const eventDoc = doc(db, 'events', ticket?.eventId!)
			const eventSnapshot = await getDoc(eventDoc)
			setEvent({
				...eventSnapshot.data(),
				createdAt: eventSnapshot.data()?.createdAt.toDate(),
				eventTime: eventSnapshot.data()?.eventTime.toDate(),
				eventDate: eventSnapshot.data()?.eventDate.toDate(),
				updatedAt: eventSnapshot.data()?.updatedAt?.toDate(),
				gatesOpen: eventSnapshot.data()?.gatesOpen?.toDate(),
				gatesClose: eventSnapshot.data()?.gatesClose?.toDate(),
			} as EventType) 
		}

		if(ticket) fetchEvent()
	}, [ticket])

	if(!ticket || !event) return null

	return (
		<section className='w-screen h-screen flex items-center justify-center'>
			<div className={`relative flex items-center justify-center w-[931px] h-[384px] overflow-hidden`}>
				<Image
					src={event?.displayPageImage}
					width={931}
					height={384}
					alt="background"
					className='bg-image blur-md'
					priority
				/>
				<div className='h-[281px] w-[685px] flex rounded-2xl bg-gradient-to-b from-[#00030D] from-[-5.87%] to-[#15081F] to-[101.65%] overflow-hidden'>
					<div className='flex flex-col h-full justify-between w-[423px]'>
						<div className='relative flex w-[423px] h-[162px]'>
							<Image
								src={event?.eventPageImage}
								width={423}
								height={162}
								alt="background"
								className='bg-image-inside'
								priority
							/>
							<div className='absolute top-[0%] left-[-48px] w-[110px] h-[37px] rotate-[270deg] flex items-center justify-start bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] z-50'>
								<p className='font-poppins font-extralight text-white text-[8px] ml-1 mt-3'>1 Person Entry</p>
							</div>
						</div>
						<p className='text-white font-bold w-full text-center text-2xl'>{event.name}</p>
						<div className='border-t-[4px] border-r-[4px] border-white w-[150px] h-[45px] flex items-center justify-center bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] z-50'>
							<p className='font-poppins font-extralight text-white text-xs text-center'>{Object.keys(ticket.tickets)[0]}</p>
						</div>
					</div>
					<div className='flex flex-col justify-between items-center py-6'>
						<p className='text-white font-bold w-full text-center text-xl'>{`${months[event.eventDate?.getMonth()]}, ${getDaySuffix(event.eventDate?.getDate())}, ${event.eventDate?.getFullYear()}`}</p>
						<p className='text-white font-bold w-full text-center text-xl'>{event.city}, {event.country}</p>
						<div className='h-14 w-px bg-[rgba(255,255,255,0.5)]' />
						<p className='text-[rgba(255,255,255,0.5)] font-semibold w-full text-center text-sm'>{formatTime(event.eventDate)}</p>
						<p className='text-white font-semibold w-full text-center text-sm'>at</p>
						<p className='text-[rgba(255,255,255,0.5)] font-semibold w-full text-center text-sm'>{event.venue}</p>
						<p className='text-[rgba(255,255,255,0.5)] font-semibold w-full text-center text-xs mt-2'>{event.gatesOpen && `Gates open ${formatTime(event.gatesOpen)}`} {event.gatesClose && `Gates close ${formatTime(event.gatesClose)}`}</p>
					</div>
				</div>
				<div className='flex items-center justify-center h-[255px] min-w-[30px] max-w-[30px] rounded-[2px] bg-gradient-to-b from-[#00030D] from-[-5.87%] to-[#15081F] to-[101.65%]'>
					<div className='h-[1px] min-w-[255px] rotate-90' style={{ background: 'repeating-linear-gradient(90deg,var(--ds-gray-600),var(--ds-gray-600) 4px,transparent 4px,transparent 10px)' }} />
				</div>
				<div className='flex-col justify-between py-6 h-[281px] w-[170px] flex rounded-2xl bg-gradient-to-b from-[#00030D] from-[-5.87%] to-[#15081F] to-[101.65%]'>
					<Image
						src="/assets/logo.png"
						width={195}
						height={73}
						alt="logo"
						className='cursor-pointer z-[9999] max-lg:w-[120px] max-lg:h-[45px]'
						priority
					/>
					<div className='flex items-center justify-center qrcodeHeight'>
						{/* <QrCode values="sadawddwadaw" /> */}
						<QRCode value={ticket.id} height='90%' />
					</div>
				</div>
			</div>
		</section>
	)
}