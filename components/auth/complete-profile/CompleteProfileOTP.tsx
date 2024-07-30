'use client'
import { UserType } from "@/lib/types/userTypes";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { auth, db } from "@/firebase/client/config";
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
import { deleteUser, PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber, signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";

type Props = {
    user: UserType;
}

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier
        confirmationResult?: any
    }
}

const NUMS_ONLY = /^\d+$/

export default function CompleteProfileOTP({ user }: Props) 
{
    const router = useRouter()
    const pathname = usePathname()

    const { t } = useTranslation()

    const [loading, setLoading] = useState(false)
    const [sentOtp, setSentOtp] = useState(false)
    const [verificationId, setVerificationId] = useState('')
    // const [timer, setTimer] = useState(60)
    const [error, setError] = useState('')
    const { toast } = useToast()

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

    // useEffect(() => {
    //     if(auth)
    //     {
    //         try
    //         {
    //             window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    //                 'size': 'invisible',
    //                 'callback': (response: any) => {
    //                     handleSendCode()
    //                 },
    //             })
    //         }
    //         catch(e)
    //         {
    //             setError('Something went wrong! Please try again.')
    //         }
    //     }
    // }, [auth])

    const initiateRecaptcha = async () => {
        try
        {
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

            const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible'
            })
            const confirmationResult = await signInWithPhoneNumber(auth, `${user.countryCode}${user.phoneNumber?.startsWith('0') ? user.phoneNumber.slice(1) : user.phoneNumber}`, recaptchaVerifier)
            setVerificationId(confirmationResult.verificationId);

            // window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            //     'size': 'invisible',
            //     'callback': async (response: any) => {
            //         await handleSendCode()
            //         await window.recaptchaVerifier?.clear()
            //     },
            //     'expired-callback': () => {
            //     }
            // })
            // window.recaptchaVerifier.render()
        }
        catch(e: any)
        {
            setError('Something went wrong22')
            console.error(e)
        }
    }
    
    // const handleSendCode = async () => {
    //     try
    //     {
    //         const appVerifier = window.recaptchaVerifier
    //         const fullPhoneNumber = `${user.countryCode}${user.phoneNumber?.startsWith('0') ? user.phoneNumber.slice(1) : user.phoneNumber}`
    //         await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier!)
    //         .then((confirmationResult) => {
    //             window.confirmationResult = confirmationResult
    //         })
    //         .catch((error) => {
    //             console.error(error)
    //             setError(error.message)
    //         })
    //     }
    //     catch(e: any)
    //     {
    //         console.error(e)
    //         setError('Something went wrong33')
    //     }
    // }
    
    const handleSubmitOtp = async (otp: string) => {
        const credential = PhoneAuthProvider.credential(verificationId, otp)
        await signInWithCredential(auth, credential)
        await updateDoc(doc(db, "users", user.id!), { verified: true })
        // await window.confirmationResult?.confirm(otp).then(async (result: any) => {
        //     await updateDoc(doc(db, "users", user.id!), { verified: true })
        // })
    }

    const onSubmit = async (values: z.infer<typeof OtpSchema>) => {
        setLoading(true)
        try
        {
            await handleSubmitOtp(values.otp)
        }
        catch(e)
        {
            setError('Invalid OTP! Please try again')
        }
        router.refresh()
        setLoading(false)
    }

    useEffect(() => {
        initiateRecaptcha()
    }, [])

    useEffect(() => {
        if(error !== '') setTimeout(() => setError(''), 3000)
    }, [error])

        
    return (
        <section className={cn('h-screen flex flex-col justify-center items-center bg-black w-fit z-10 lg:px-24 pt-12 max-lg:max-w-[100vw] max-lg:w-screen', pathname?.includes('/ar') ? 'mr-auto' : 'ml-auto')}>
            <p className='font-poppins font-base mb-6 text-white'>{t('auth:verifyNumber')}</p>
            <Form {...form}>
                <form dir='ltr' onSubmit={form.handleSubmit(onSubmit)} className="w-fit space-y-10">
                    {/* { */}
                        {/* sentOtp ? ( */}
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormControl>
                                            <InputOTP pattern={NUMS_ONLY.source} maxLength={6} {...field}>
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
                        {/* ) : ( */}
                            <p className='font-poppins text-md mb-6 text-white'>{t('auth:codeSent')} {user.countryCode}{user.phoneNumber?.startsWith('0') ? user.phoneNumber.slice(1) : user.phoneNumber}</p>
                        {/* ) */}
                    {/* } */}
                    {/* {sentOtp ? ( */}
                        {/* // <> */}
                            <button type="submit" className='rounded-md font-light py-5 px-10 bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-full text-white font-poppins'>{t('auth:verify')}</button>
                            {/* <span onClick={handleSendCode} className={('flex items-center justify-center text-center cursor-pointer rounded-md font-light py-5 px-10')}>Resend Code ({timer})</span> */}
                        {/* </> */}
                    {/* ) : ( */}
                        {/* <span onClick={initiateRecaptcha} className='flex items-center justify-center text-center cursor-pointer rounded-md font-light py-5 px-10 bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-full text-white font-poppins'>{t('auth:sendCode')}</span> */}
                    {/* )} */}
                <div id="recaptcha-container" /> 
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
