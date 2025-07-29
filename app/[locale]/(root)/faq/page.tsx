import { initTranslations } from '@/lib/utils'
import { cn } from '@/lib/utils'

type Props = {
    params: {
        locale?: string | undefined
    }
}

export default async function FAQPage({ params }: Props) {
    const { t } = await initTranslations(params.locale!, ['homepage', 'common', 'auth'])

    const faqs = [
        {
            question: "What is Vibes?",
            answer: "Vibes is your go-to ticketing platform for premium events across UAE, KSA, and Egypt. We provide access to the best concerts, sports events, theater shows, and more."
        },
        {
            question: "How do I purchase tickets?",
            answer: "Simply browse our events, select your preferred event, choose your tickets, and proceed to checkout. You can pay securely using various payment methods."
        },
        {
            question: "Can I get a refund for my tickets?",
            answer: "Refund policies vary by event. Please check the specific event's terms and conditions. Generally, tickets are non-refundable unless the event is cancelled."
        },
        {
            question: "How will I receive my tickets?",
            answer: "After successful payment, you'll receive your tickets via email. You can also access them in your profile under 'My Tickets' section."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, Mastercard, American Express), as well as local payment methods depending on your country."
        },
        {
            question: "Can I resell my tickets?",
            answer: "Yes, for selected events, you can list your tickets on our resell market. Check if reselling is enabled for your specific event."
        },
        {
            question: "Is there a mobile app?",
            answer: "Currently, we offer a mobile-optimized website. A dedicated mobile app is coming soon for both iOS and Android."
        },
        {
            question: "What happens if an event is cancelled?",
            answer: "If an event is cancelled by the organizer, you will receive a full refund automatically. You'll be notified via email about the cancellation and refund process."
        },
        {
            question: "Can I transfer my tickets to someone else?",
            answer: "Ticket transfer policies depend on the event organizer. Some events allow transfers while others don't. Check your ticket details for transfer options."
        },
        {
            question: "How do I contact customer support?",
            answer: "You can reach our customer support team through the contact form on our website or send us an email. We're here to help with any questions or issues."
        }
    ]

    return (
        <div dir={params.locale === 'ar' ? 'rtl' : 'ltr'} className='flex flex-col items-center justify-start min-h-screen w-full px-6 py-12'>
            <div className='max-w-4xl w-full'>
                <h1 className='font-poppins text-white text-4xl font-bold text-center mb-12'>
                    Frequently Asked Questions
                </h1>
                
                <div className='space-y-6'>
                    {faqs.map((faq, index) => (
                        <div 
                            key={index}
                            className='bg-[rgba(255,255,255,0.1)] backdrop-blur-sm rounded-lg p-6 border border-[rgba(255,255,255,0.2)]'
                        >
                            <h3 className='font-poppins text-white text-lg font-semibold mb-3'>
                                {faq.question}
                            </h3>
                            <p className='font-poppins text-gray-300 text-base leading-relaxed'>
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
                
                <div className='mt-12 text-center'>
                    <p className='font-poppins text-gray-400 text-sm'>
                        Still have questions? Feel free to contact our support team.
                    </p>
                </div>
            </div>
        </div>
    )
} 