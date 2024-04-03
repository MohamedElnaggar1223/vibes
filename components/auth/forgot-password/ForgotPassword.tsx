'use client'
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { countryCodes } from "@/constants"
import { auth } from "@/firebase/client/config";
import { cn } from "@/lib/utils";
import { UserForgotPasswordSchema } from "@/lib/validations/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendPasswordResetEmail } from "firebase/auth";
import { Loader2 } from "lucide-react"
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next";
import { z } from "zod"

export default function ForgotPassword()
{
    const router = useRouter()
    const pathname = usePathname()

    const { t } = useTranslation()

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

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

    const form = useForm<z.infer<typeof UserForgotPasswordSchema>>({
        resolver: zodResolver(UserForgotPasswordSchema),
        defaultValues: {
            email: ''
        },
    })

    const onSubmit = async (values: z.infer<typeof UserForgotPasswordSchema>) => {
        setLoading(true)
        await sendPasswordResetEmail(auth, values.email).then(() => setSuccess(true))
        router.refresh()
        setLoading(false)
    }

    return (
        <section className={cn('h-screen flex flex-col justify-center items-center bg-black w-fit z-10 lg:px-24 pt-12 max-lg:max-w-[100vw] max-lg:w-screen', pathname?.includes('/ar') ? 'mr-auto' : 'ml-auto')}>
            <p className='font-poppins font-base mb-6 text-white'>Reset Password</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit space-y-10">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormControl dir='ltr'>
                                    <input 
                                        placeholder={t('auth:email')}
                                        className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-screen max-w-[412px] max-sm:max-w-[340px] outline-none rounded-md'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="absolute font-poppins text-[#7F1D1D]" />
                                {success && (
                                    <div className='w-full flex gap-2 items-center justify-start'>
                                        <Image
                                            src='/assets/check.svg' 
                                            width={25}
                                            height={25}
                                            alt='check'
                                        />
                                        <p className='font-medium text-md text-white font-poppins'>Reset Email Link Sent Successfully!</p>                   
                                    </div>
                                )}
                            </FormItem>
                        )}
                    />
                    <button onClick={() => setSuccess(false)} type="submit" className='rounded-md font-light py-5 px-10 bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-full text-white font-poppins'>Send Link</button>
                </form>
            </Form>
            <Dialog open={loading}>
                <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                    <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                </DialogContent>
            </Dialog>
        </section>
    )
}