'use client'
import { UserType } from "@/lib/types/userTypes";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { db } from "@/firebase/client/config";
import { updateDoc, doc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { OtpSchema } from "@/lib/validations/otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { sendEmailOTP } from "@/lib/server";

type Props = {
    user: UserType;
}

const NUMS_ONLY = /^\d+$/

export default function CompleteProfileOTP({ user }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const { t } = useTranslation()
    const { toast } = useToast()

    const [loading, setLoading] = useState(false)
    const [sentOtp, setSentOtp] = useState(false)
    const [error, setError] = useState('')
    const [generatedOTP, setGeneratedOTP] = useState('')

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (loading) {
                event.preventDefault()
                event.stopPropagation()
            }
        }

        window.addEventListener('click', handleClickOutside)
        return () => {
            window.removeEventListener('click', handleClickOutside)
        }
    }, [loading])

    const form = useForm<z.infer<typeof OtpSchema>>({
        resolver: zodResolver(OtpSchema),
        defaultValues: {
            otp: '',
        },
    })

    const generateOTP = () => {
        // Generate a 6-digit OTP
        return Math.floor(100000 + Math.random() * 900000).toString()
    }

    const initiateEmailOTP = async () => {
        try {
            const newOTP = generateOTP()
            setGeneratedOTP(newOTP)

            await sendEmailOTP(user.email!, newOTP)

            setSentOtp(true)
            toast({
                action: (
                    <Image
                        src='/assets/check.svg'
                        width={25}
                        height={25}
                        alt='check'
                    />
                ),
                title: 'Code Sent Successfully!',
            })
        } catch (e) {
            console.error(e)
            setError('Failed to send verification code')
        }
    }

    const handleSubmitOtp = async (submittedOTP: string) => {
        if (submittedOTP === generatedOTP) {
            await updateDoc(doc(db, "users", user.id!), { verified: true })
            return true
        }
        throw new Error('Invalid OTP')
    }

    const onSubmit = async (values: z.infer<typeof OtpSchema>) => {
        setLoading(true)
        try {
            await handleSubmitOtp(values.otp)
            router.refresh()
        } catch (e) {
            setError('Invalid OTP! Please try again')
        }
        setLoading(false)
    }

    useEffect(() => {
        initiateEmailOTP()
    }, [])

    useEffect(() => {
        if (error !== '') setTimeout(() => setError(''), 3000)
    }, [error])

    return (
        <section className={cn('h-screen flex flex-col justify-center items-center bg-black w-fit z-10 lg:px-24 pt-12 max-lg:max-w-[100vw] max-lg:w-screen', pathname?.includes('/ar') ? 'mr-auto' : 'ml-auto')}>
            <p className='font-poppins font-base mb-6 text-white'>{t('auth:verifyEmail')}</p>
            <Form {...form}>
                <form dir='ltr' onSubmit={form.handleSubmit(onSubmit)} className="w-fit space-y-10">
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormControl>
                                    <InputOTP disabled={!sentOtp} pattern={NUMS_ONLY.source} maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot className="bg-white w-12 h-12 text-xl" index={0} />
                                            <InputOTPSlot className="bg-white w-12 h-12 text-xl" index={1} />
                                            <InputOTPSlot className="bg-white w-12 h-12 text-xl" index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator className='text-white' />
                                        <InputOTPGroup>
                                            <InputOTPSlot className="bg-white w-12 h-12 text-xl" index={3} />
                                            <InputOTPSlot className="bg-white w-12 h-12 text-xl" index={4} />
                                            <InputOTPSlot className="bg-white w-12 h-12 text-xl" index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage className="absolute font-poppins text-[#7F1D1D]" />
                            </FormItem>
                        )}
                    />
                    <p className='font-poppins text-md mb-6 text-white'>{t('auth:codeSent')} {user.email}</p>
                    <button type="submit" className='rounded-md font-light py-5 px-10 bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-full text-white font-poppins'>{t('auth:verify')}</button>
                </form>
            </Form>
            <Dialog open={loading}>
                <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                    <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                </DialogContent>
            </Dialog>
            <Dialog open={error !== ''}>
                <DialogContent className='flex items-center justify-center bg-white border-none outline-none text-center'>
                    <p className='text-black mt-2 font-poppins text-lg font-semibold text-center'>{error}</p>
                </DialogContent>
            </Dialog>
        </section>
    )
}