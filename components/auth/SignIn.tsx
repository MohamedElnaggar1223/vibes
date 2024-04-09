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
import { FacebookAuthProvider, GoogleAuthProvider, TwitterAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth } from "@/firebase/client/config"
import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { authErrors } from "@/constants"
import { Eye, EyeOff } from 'lucide-react';
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

export default function SignIn()
{
    const router = useRouter()
    const pathname = usePathname()

    const { t } = useTranslation()

    const [passwordVisible, setPasswordVisible] = useState(false)
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
        catch(e: any)
        {
            //@ts-expect-error authError
            if(e.code !== 'auth/cancelled-popup-request') setError(Object.keys(authErrors).includes(e.code) ? authErrors[e.code] : 'Something Went Wrong!')   
        }
        finally
        {
            setLoading(false)
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
        catch(e: any)
        {
            //@ts-expect-error authError
            if(e.code !== 'auth/cancelled-popup-request') setError(Object.keys(authErrors).includes(e.code) ? authErrors[e.code] : 'Something Went Wrong!')   
        }
        finally
        {
            setLoading(false)
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
        catch(e: any)
        {
            //@ts-expect-error authError
            if(e.code !== 'auth/cancelled-popup-request') setError(Object.keys(authErrors).includes(e.code) ? authErrors[e.code] : 'Something Went Wrong!')   
        }
        finally
        {
            setLoading(false)
        }
    }

    const handleFacebookSignIn = async () => {
        try
        {
            const provider = new FacebookAuthProvider()
            const user = await signInWithPopup(auth, provider)
            if(user.user)
            {
                setLoading(true)
                await signIn('credentials', { name: user.user.displayName, phoneNumber: user.user.phoneNumber ?? '',  email: user.user.email, password: '', id: user.user.uid, provider: 'facebook', redirect: true, callbackUrl: '/' })
                setLoading(false)
            }
        }
        catch(e: any)
        {
            //@ts-expect-error authError
            if(e.code !== 'auth/cancelled-popup-request') setError(Object.keys(authErrors).includes(e.code) ? authErrors[e.code] : 'Something Went Wrong!')   
        }
        finally
        {
            setLoading(false)
        }
    }

    return (
        <section className={cn('h-screen flex flex-col justify-center items-center bg-black w-fit z-10 lg:px-24 max-lg:max-w-[100vw] max-lg:w-screen', pathname?.includes('/ar') ? 'mr-auto' : 'ml-auto')}>
            <p className='font-poppins font-base mb-6 text-white'>{t('auth:signIn')}</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit space-y-10 flex flex-col items-center justify-center">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormControl>
                                    <input 
                                        placeholder={t('auth:email')}
                                        className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-screen max-w-[412px] max-sm:max-w-[340px] outline-none rounded-md'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="absolute font-poppins text-[#7F1D1D]" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormControl>
                                    <div className="relative">
                                        <input 
                                            placeholder={t('auth:password')}
                                            type={passwordVisible ? 'text' : 'password'}
                                            className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-screen max-w-[412px] max-sm:max-w-[340px] outline-none rounded-md'
                                            {...field}
                                        />
                                        {passwordVisible ? (
                                            <Eye 
                                                className={cn('absolute top-[32%] z-50 cursor-pointer', pathname?.includes('/ar') ? 'left-[5%]' : 'left-[90%]')} 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setPasswordVisible(prev => !prev)
                                                }} 
                                            />
                                        ) : (
                                            <EyeOff 
                                                className={cn('absolute top-[32%] z-50 cursor-pointer', pathname?.includes('/ar') ? 'left-[5%]' : 'left-[90%]')} 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setPasswordVisible(prev => !prev)
                                                }} 
                                            />
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage className="absolute font-poppins text-[#7F1D1D]" />
                                <p onClick={() => router.push('/forgot-password')} className='text-white font-poppins text-sm font-light w-full flex justify-end cursor-pointer forgotpass'>{t('auth:forgot')}</p>
                            </FormItem>
                        )}
                    />
                    <div className='w-full flex justify-between items-center gap-2'>
                        <span className='h-[1px] bg-[rgba(255,255,255,0.5)] flex-1'></span>
                        <p className='text-white font-poppins text-xs font-light'>{t('auth:orsignUp')}</p>
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
                        <span onClick={handleFacebookSignIn} className='cursor-pointer hover:bg-[#f1f1f1] w-[5.5rem] h-11 bg-white rounded-md shadow-md flex items-center justify-center'>
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
                    <button type="submit" className='rounded-md font-light py-5 px-10 bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-full text-white font-poppins'>{t('auth:signIn')}</button>
                </form>
                <p className='text-white mt-2 font-poppins text-sm text-center text-nowrap'>{t('auth:noaccount')} <span onClick={() => router.push('/sign-up')} className='text-[#E72377] font-medium font-poppins text-sm cursor-pointer'>{t('auth:signUp')}</span></p>
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