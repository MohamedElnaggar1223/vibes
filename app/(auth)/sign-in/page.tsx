'use client'
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form"
import { UserSignInSchema } from "@/lib/validations/user"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/firebase/client/config"
import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SignIn()
{
    const router = useRouter()

    const [loading, setLoading] = useState(false)

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

    const form = useForm<z.infer<typeof UserSignInSchema>>({
        resolver: zodResolver(UserSignInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handlePhoneNumberChage = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const value = e.target.value
        onChange(value.replace(/[^\d]/g, ''))
    }

    const onSubmit = async (values: z.infer<typeof UserSignInSchema>) => {
        setLoading(true)
        await signInWithEmailAndPassword(auth, values.email, values.password)
        .then(async (userCredentials) => {
            await signIn("credentials", { email: values.email, password: values.password, id: userCredentials.user.uid, redirect: true, callbackUrl: '/' })
            setLoading(false)
        })
    }

    return (
        <section className='h-screen flex flex-col justify-center items-center bg-black w-fit ml-auto z-10 px-24'>
            <p className='font-poppins font-base mb-6 text-white'>Sign in</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit space-y-10">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormControl>
                                    <input 
                                        placeholder="Email" 
                                        className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-screen max-w-[412px] outline-none rounded-md'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="absolute font-poppins" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormControl>
                                    <input 
                                        placeholder="Password" 
                                        type='password'
                                        className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-full outline-none rounded-md'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="absolute font-poppins" />
                            </FormItem>
                        )}
                    />
                    <div className='w-full flex justify-between items-center gap-2'>
                        <span className='h-[1px] bg-[rgba(255,255,255,0.5)] flex-1'></span>
                        <p className='text-white font-poppins text-xs font-light'>or sign in using</p>
                        <span className='h-[1px] bg-[rgba(255,255,255,0.5)] flex-1'></span>
                    </div>
                    <div className='w-full flex justify-center items-center gap-6'>
                        <span className='w-[5.5rem] h-11 bg-white rounded-md shadow-md flex items-center justify-center'>
                            <Image
                                src='/assets/google.svg' 
                                width={16}
                                height={16}
                                alt='google'
                            />
                        </span>
                        <span className='w-[5.5rem] h-11 bg-white rounded-md shadow-md flex items-center justify-center'>
                            <Image
                                src='/assets/facebook.svg' 
                                width={19}
                                height={19}
                                alt='facebook'
                            />
                        </span>
                        <span className='w-[5.5rem] h-11 bg-white rounded-md shadow-md flex items-center justify-center'>
                            <Image
                                src='/assets/x.svg'
                                width={15}
                                height={15}
                                alt='x'
                            />
                        </span>
                    </div>
                    <button type="submit" className='rounded-md font-light py-5 px-10 bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-full text-white font-poppins'>Sign in</button>
                </form>
                <p className='text-white mt-2 font-poppins text-sm'>Don't have an account yet? <span onClick={() => router.push('/sign-up')} className='text-[#E72377] font-medium font-poppins text-sm cursor-pointer'>Sign Up</span></p>
            </Form>
            <Dialog open={loading}>
                <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                    <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                </DialogContent>
            </Dialog>
        </section>
    )
}