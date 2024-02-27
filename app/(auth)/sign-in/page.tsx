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
import { GoogleAuthProvider, TwitterAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth } from "@/firebase/client/config"
import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SignIn()
{
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

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

    useEffect(() => {
        if(error !== '') setTimeout(() => setError(''), 3000)
    }, [error])

    const form = useForm<z.infer<typeof UserSignInSchema>>({
        resolver: zodResolver(UserSignInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof UserSignInSchema>) => {
        setLoading(true)
        try
        {
            await signInWithEmailAndPassword(auth, values.email, values.password)
            .then(async (userCredentials) => {
                await signIn("credentials", { email: values.email, password: values.password, id: userCredentials.user.uid, redirect: true, callbackUrl: '/' })
                setLoading(false)
            })
        }
        catch(e)
        {
            setError('Something went wrong!')
        }
    }

    const handleGoogleSignIn = async ()  => {
        try
        {
            const provider = new GoogleAuthProvider()
            const user = await signInWithPopup(auth, provider)
            if(user.user) 
            {
                setLoading(true)
                await signIn('credentials', { name: user.user.displayName, phoneNumber: user.user.phoneNumber ?? '',  email: user.user.email, password: '', id: user.user.uid, provider: 'google', redirect: true, callbackUrl: '/' })
                setLoading(false)
            }
        }
        catch(e)
        {
            setError('Something went wrong!')   
        }
    }

    const handleXSignIn = async () => {
        try
        {
            const provider = new TwitterAuthProvider()
            const user = await signInWithPopup(auth, provider)
            if(user.user) 
            {
                setLoading(true)
                await signIn('credentials', { name: user.user.displayName, phoneNumber: user.user.phoneNumber ?? '',  email: user.user.email, password: '', id: user.user.uid, provider: 'twitter', redirect: true, callbackUrl: '/' })
                setLoading(false)
            }
        }
        catch(e)
        {
            setError('Something went wrong!')
        }
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
                        <span onClick={handleGoogleSignIn} className='cursor-pointer hover:bg-[#f1f1f1] w-[5.5rem] h-11 bg-white rounded-md shadow-md flex items-center justify-center'>
                            <Image
                                src='/assets/google.svg' 
                                width={16}
                                height={16}
                                alt='google'
                            />
                        </span>
                        <span className='cursor-pointer hover:bg-[#f1f1f1] w-[5.5rem] h-11 bg-white rounded-md shadow-md flex items-center justify-center'>
                            <Image
                                src='/assets/facebook.svg' 
                                width={19}
                                height={19}
                                alt='facebook'
                            />
                        </span>
                        <span onClick={handleXSignIn} className='cursor-pointer hover:bg-[#f1f1f1] w-[5.5rem] h-11 bg-white rounded-md shadow-md flex items-center justify-center'>
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
            <Dialog open={error !== ''}>
                <DialogContent className='flex items-center justify-center bg-white border-none outline-none'>
                    <p className='text-black mt-2 font-poppins text-lg font-semibold'>{error}</p>
                </DialogContent>
            </Dialog>
        </section>
    )
}