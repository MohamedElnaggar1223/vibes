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
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/firebase/client/config"
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignUp()
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
        await createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(async (userCredentials) => {
            const userRef = doc(db, "users", userCredentials.user.uid) 
            await setDoc(userRef, { firstname: values.firstname, lastname: values.lastname, email: values.email, countryCode: values.countryCode, phoneNumber: values.phoneNumber, verified: false})
            await signIn("credentials", { email: values.email, password: values.password, id: userCredentials.user.uid, redirect: true, callbackUrl: '/' })
            setLoading(false)
        })
    }

    return (
        <section className='h-screen flex flex-col justify-center items-center bg-black w-fit ml-auto z-10 px-24 pt-12'>
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
                    <button type="submit" className='rounded-md font-light py-5 px-10 bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-full text-white font-poppins'>Sign up</button>
                </form>
                <p className='text-white mt-2 font-poppins text-sm'>Already have an account? <span onClick={() => router.push('/sign-in')} className='text-[#E72377] font-medium font-poppins text-sm cursor-pointer'>Sign In</span></p>
            </Form>
            <Dialog open={loading}>
                <DialogContent className='flex items-center justify-center bg-transparent border-none outline-none'>
                    <Loader2 className='animate-spin' size={42} color="#5E1F3C" />
                </DialogContent>
            </Dialog>
        </section>
    )
}