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
import { addDoc, collection } from "firebase/firestore"

export default function SignUp()
{
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

    const onSubmit = async (values: z.infer<typeof UserSignUpSchema>) => {
        await createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(async (userCredentials) => {
            await addDoc(collection(db, "users"), { firstname: values.firstname, lastname: values.lastname, email: values.email, countryCode: values.countryCode, phoneNumber: values.phoneNumber, id: userCredentials.user.uid})
            await signIn("credentials", { email: values.email, password: values.password, id: userCredentials.user.uid, redirect: true, callbackUrl: '/' })
        })
    }

    return (
        <section className='h-screen flex flex-col justify-center items-center bg-black w-fit ml-auto z-10 px-24'>
            <p className='font-poppins font-base mb-6 text-white'>Sign up</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit space-y-8">
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
                                <FormMessage className="absolute" />
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
                                <FormMessage className="absolute" />
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
                                <FormMessage className="absolute" />
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
                                            <select {...field} className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-2 outline-none rounded-md z-10'>
                                                {countryCodes.map((countryCode, index) => (<option key={index} value={countryCode}>{countryCode}</option>))}
                                            </select>
                                            <div className='h-14 bg-[rgba(0,0,0,0.25)] rotate-180 w-[2px] top-1 left-[60%] absolute z-20' />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="absolute" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormControl>
                                        <input 
                                            placeholder="Phone Number" 
                                            className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-full outline-none rounded-md'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="absolute" />
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
                                <FormMessage className="absolute" />
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
                                <FormMessage className="absolute" />
                            </FormItem>
                        )}
                    />
                    <button type="submit" className='rounded-md font-light py-5 px-10 bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] w-full text-white font-poppins'>Submit</button>
                </form>
            </Form>
        </section>
    )
}