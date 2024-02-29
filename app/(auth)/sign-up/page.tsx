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
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SignUp()
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
                await setDoc(userRef, { firstname: values.firstname, lastname: values.lastname, email: values.email, countryCode: values.countryCode, phoneNumber: values.phoneNumber, verified: true, provider: 'credentials' })
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
        <section className='min-h-screen flex flex-col justify-center items-center bg-black w-fit ml-auto z-10 px-24 pt-12 overflow-auto'>
            <div className='flex flex-col justify-center items-center mt-3'>
                <p className='font-poppins font-base mb-6 text-white'>Sign up</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit space-y-10">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormControl>
                                        <input 
                                            placeholder="First Name" 
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
                            name="lastname"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormControl>
                                        <input 
                                            placeholder="Last Name" 
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
                        <div className='w-screen max-w-[412px] flex gap-4'>
                            <FormField
                                control={form.control}
                                name="countryCode"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormControl>
                                            <div className='relative'>
                                                <select {...field} className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-2 outline-none rounded-md z-10 appearance-none'>
                                                    {countryCodes.map((countryCode, index) => (<option key={index} value={countryCode}>{countryCode}</option>))}
                                                </select>
                                                <div className='h-14 bg-[rgba(0,0,0,0.25)] rotate-180 w-[2px] top-1 left-[60%] absolute z-20' />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4z"/></svg>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="absolute font-poppins" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem className="ml-auto flex-1">
                                        <FormControl>
                                            <input 
                                                placeholder="Phone Number" 
                                                className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-full outline-none rounded-md flex-1'
                                                {...field}
                                                onChange={(e) => handlePhoneNumberChage(e, field.onChange)}
                                            />
                                        </FormControl>
                                        <FormMessage className="absolute font-poppins" />
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
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormControl>
                                        <input 
                                            placeholder="Confirm Password" 
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
                            <p className='text-white font-poppins text-xs font-light'>or sign up using</p>
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
                        <button type="submit" className='rounded-md font-light py-5 px-10 bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-full text-white font-poppins'>Sign up</button>
                    </form>
                    <p className='text-white mt-2 font-poppins text-sm'>Already have an account? <span onClick={() => router.push('/sign-in')} className='text-[#E72377] font-medium font-poppins text-sm cursor-pointer'>Sign In</span></p>
                </Form>
            </div>
            <Dialog open={loading}>
                <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                    <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                </DialogContent>
            </Dialog>
        </section>
    )
}