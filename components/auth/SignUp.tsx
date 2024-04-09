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
import { UserSignUpSchema } from "@/lib/validations/user"
import { countryCodes } from "@/constants"
import { FacebookAuthProvider, GoogleAuthProvider, TwitterAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, db } from "@/firebase/client/config"
import { doc, setDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"

export default function SignUp()
{
    const router = useRouter()
    const pathname = usePathname()

    const { t } = useTranslation()
 
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
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

    const form = useForm<z.infer<typeof UserSignUpSchema>>({
        resolver: zodResolver(UserSignUpSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            countryCode: "+20",
            phoneNumber: "",
            password: "",
            confirmPassword: ""
        },
    })

    const handlePhoneNumberChage = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const value = e.target.value
        onChange(value.replace(/[^\d]/g, ''))
    }

    const onSubmit = async (values: z.infer<typeof UserSignUpSchema>) => {
        setLoading(true)
        try
        {
            await createUserWithEmailAndPassword(auth, values.email, values.password)
            .then(async (userCredentials) => {
                const userRef = doc(db, "users", userCredentials.user.uid) 
                //set verified to false when OTP
                await setDoc(userRef, { firstname: values.firstname, lastname: values.lastname, email: values.email, countryCode: values.countryCode, phoneNumber: values.phoneNumber, verified: false, provider: 'credentials', id: userCredentials.user.uid, tickets: [] })
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
        catch(e)
        {
            setError('Something went wrong!')
        }
    }

    return (
        <section className={cn('min-h-screen flex flex-col justify-center items-center bg-black w-fit z-10 lg:px-24 pt-12 overflow-auto max-lg:w-screen max-lg:max-w-[100vw] max-lg:pb-4', pathname?.includes('/ar') ? 'mr-auto' : 'ml-auto')}>
            <div className='flex flex-col justify-center items-center mt-3'>
                <p className='font-poppins font-base mb-6 text-white'>{t('auth:signUp')}</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit space-y-10 flex flex-col items-center justify-center">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormControl>
                                        <input 
                                            placeholder={t('auth:firstname')} 
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
                            name="lastname"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormControl>
                                        <input 
                                            placeholder={t('auth:lastname')}
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
                        <div dir='ltr' className='w-screen max-w-[412px] max-sm:max-w-[340px] flex gap-4'>
                            <FormField
                                control={form.control}
                                name="countryCode"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormControl>
                                            <div dir='ltr' className='relative'>
                                                <select {...field} className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-2 outline-none rounded-md z-10 appearance-none'>
                                                    {countryCodes.map((countryCode, index) => (<option key={index} value={countryCode}>{countryCode}</option>))}
                                                </select>
                                                <div className='h-14 bg-[rgba(0,0,0,0.25)] rotate-180 w-[2px] top-1 left-[60%] absolute z-20' />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4z"/></svg>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="absolute font-poppins text-[#7F1D1D]" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem className="ml-auto flex-1">
                                        <FormControl dir='rtl'>
                                            <input 
                                                placeholder={t('auth:number')}
                                                className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-full outline-none rounded-md flex-1'
                                                {...field}
                                                onChange={(e) => handlePhoneNumberChage(e, field.onChange)}
                                            />
                                        </FormControl>
                                        <FormMessage className="absolute font-poppins text-[#7F1D1D]" />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormControl>
                                        <div className="relative">
                                            <input 
                                                placeholder={t('auth:confirmpassword')}
                                                type={confirmPasswordVisible ? 'text' : 'password'}
                                                className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-screen max-w-[412px] max-sm:max-w-[340px] outline-none rounded-md'
                                                {...field}
                                            />
                                            {confirmPasswordVisible ? (
                                                <Eye 
                                                    className={cn('absolute top-[32%] z-50 cursor-pointer', pathname?.includes('/ar') ? 'left-[5%]' : 'left-[90%]')} 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setConfirmPasswordVisible(prev => !prev)
                                                    }} 
                                                />
                                            ) : (
                                                <EyeOff 
                                                    className={cn('absolute top-[32%] z-50 cursor-pointer', pathname?.includes('/ar') ? 'left-[5%]' : 'left-[90%]')} 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setConfirmPasswordVisible(prev => !prev)
                                                    }} 
                                                />
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage className="absolute font-poppins text-[#7F1D1D]" />
                                </FormItem>
                            )}
                        />
                        <div className='w-full flex justify-between items-center gap-2'>
                            <span className='h-[1px] bg-[rgba(255,255,255,0.5)] flex-1'></span>
                            <p className='text-white font-poppins text-xs font-light'>{t('auth:orsignIn')}</p>
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
                        <button type="submit" className='rounded-md font-light py-5 px-10 bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-full text-white font-poppins'>{t('auth:signUp')}</button>
                    </form>
                    <p className='text-white mt-2 font-poppins text-sm mb-3'>{t('auth:already')} <span onClick={() => router.push('/sign-in')} className='text-[#E72377] font-medium font-poppins text-sm cursor-pointer'>{t('auth:signIn')}</span></p>
                </Form>
            </div>
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