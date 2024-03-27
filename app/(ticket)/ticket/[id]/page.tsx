import { months } from "@/constants"
import { initAdmin } from "@/firebase/server/config"
import { EventType } from "@/lib/types/eventTypes"
import { TicketType } from "@/lib/types/ticketTypes"
import { formatTime, getDaySuffix } from "@/lib/utils"
import Image from "next/image"
import QRCode from "react-qr-code"

type Props = {
	params: {
		id: string
	},
	searchParams: { [key: string]: string | string[] | undefined }
}

export default async function TicketPagePdf({ params, searchParams }: Props)
{	
	const admin = await initAdmin()

	const ticketData = await admin.firestore().collection('tickets').doc(params.id).get()
	const eventData = await admin.firestore().collection('events').doc(ticketData.data()?.eventId).get()

	const ticket = {
		...ticketData.data(),
		createdAt: ticketData.data()?.createdAt.toDate(),
	} as TicketType

	const event = {
		...eventData.data(),
		createdAt: eventData.data()?.createdAt.toDate(),
		eventTime: eventData.data()?.eventTime.toDate(),
		eventDate: eventData.data()?.eventDate.toDate(),
		updatedAt: eventData.data()?.updatedAt?.toDate(),
		gatesOpen: eventData.data()?.gatesOpen?.toDate(),
		gatesClose: eventData.data()?.gatesClose?.toDate(),
	} as EventType

	return (
		<section className='w-screen h-screen flex items-center justify-center rotate-90'>
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
								fetchPriority="high"
							/>
							<div className='absolute top-[0%] left-[-48px] w-[110px] h-[37px] rotate-[270deg] flex items-center justify-start bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] z-50'>
								<p className='font-poppins font-extralight text-white text-[8px] ml-1 mt-3'>1 Person Entry</p>
							</div>
						</div>
						<p className='text-white font-bold w-full text-center text-2xl'>{event.name}</p>
						<div className='border-t-[4px] border-r-[4px] border-white w-[150px] h-[45px] flex items-center justify-center bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] z-50'>
							<p className='font-poppins font-extralight text-white text-xs text-center'>{searchParams.type}</p>
						</div>
					</div>
					<div className='flex flex-col justify-between items-center py-6'>
						<p className='text-white font-bold w-full text-center text-xl'>{`${months[event.eventDate?.getMonth()]}, ${getDaySuffix(event.eventDate?.getDate())}, ${event.eventDate?.getFullYear()}`}</p>
						<p className='text-white font-bold w-full text-center text-xl'>{event.city}, {event.country}</p>
						<div className='h-14 w-px bg-[rgba(255,255,255,0.5)]' />
						<p className='text-[rgba(255,255,255,0.5)] font-semibold w-full text-center text-sm'>{formatTime(event.eventTime)} {event.timeZone}</p>
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
						fetchPriority="high"
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