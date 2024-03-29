'use client'
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { auth } from "@/firebase/client/config";
import { cn } from "@/lib/utils";
import { UserResetPasswordSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmPasswordReset } from "firebase/auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
    oobCode: string
}

export default function ResetPassword({ oobCode }: Props)
{
    const router = useRouter()

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    
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

    const form = useForm<z.infer<typeof UserResetPasswordSchema>>({
        resolver: zodResolver(UserResetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmNewPassword: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof UserResetPasswordSchema>) => {
        setLoading(true)
        await confirmPasswordReset(auth, oobCode, values.newPassword)
                .then(() => {
                    setLoading(false)
                    setSuccess('Password reset successful!')
                })
                .catch((error) => {
                    setLoading(false)
                    setError(error.message)
                })
    }
    return (
        <section className='w-full min-h-screen flex items-center justify-center gap-8 flex-col'>
            <Image
                src="/assets/logo.png"
                width={273}
                height={102}
                alt="logo"
                className='mb-4'
            />
            {success !== '' ? (
                <>
                    <p className='font-poppins text-center w-full text-white font-medium text-base mb-2'>Password reset successful!</p>
                    <button onClick={() => router.push('/sign-in')} className='cursor-pointer rounded-md font-light py-5 px-10 w-full text-white font-poppins bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]'>Sign In</button>
                </>
            ) : (
                <>
                    <p className='font-poppins text-center w-full text-white font-medium text-base mb-2'>Reset Your Password</p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit space-y-7 flex flex-col justify-center items-center">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormControl>
                                            <div className="relative">
                                                <input 
                                                    placeholder="Password" 
                                                    type={passwordVisible ? 'text' : 'password'}
                                                    className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-screen max-w-[412px] max-sm:max-w-[340px] outline-none rounded-md'
                                                    {...field}
                                                />
                                                {passwordVisible ? (
                                                    <Eye 
                                                        className='absolute left-[90%] top-[32%] z-50 cursor-pointer' 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setPasswordVisible(prev => !prev)
                                                        }} 
                                                    />
                                                ) : (
                                                    <EyeOff 
                                                        className='absolute left-[90%] top-[32%] z-50 cursor-pointer' 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setPasswordVisible(prev => !prev)
                                                        }} 
                                                    />
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage className="absolute font-poppins text-white font-thin text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmNewPassword"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormControl>
                                            <div className="relative">
                                                <input 
                                                    placeholder="Confirm Password" 
                                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                                    className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-screen max-w-[412px] max-sm:max-w-[340px] outline-none rounded-md'
                                                    {...field}
                                                />
                                                {confirmPasswordVisible ? (
                                                    <Eye 
                                                        className='absolute left-[90%] top-[32%] z-50 cursor-pointer' 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setConfirmPasswordVisible(prev => !prev)
                                                        }} 
                                                    />
                                                ) : (
                                                    <EyeOff 
                                                        className='absolute left-[90%] top-[32%] z-50 cursor-pointer' 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setConfirmPasswordVisible(prev => !prev)
                                                        }} 
                                                    />
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage className="absolute font-poppins text-white font-thin text-xs" />
                                    </FormItem>
                                )}
                            />
                            <button disabled={form.getValues().newPassword.length === 0 || form.getValues().confirmNewPassword.length === 0} type="submit" className={cn('cursor-pointer rounded-md font-light py-5 px-10 w-full text-white font-poppins', form.getValues().newPassword.length === 0 || form.getValues().confirmNewPassword.length === 0 ? 'bg-[#D9D9D9]' : 'bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]')}>Confirm Changes</button>
                        </form>
                    </Form>
                </>
            )}
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