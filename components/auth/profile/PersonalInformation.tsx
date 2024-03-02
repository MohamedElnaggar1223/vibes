'use client'
import { UserType } from "@/lib/types/userTypes"
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
import { UserUpdateProfileSchema } from "@/lib/validations/user"
import { Dispatch, SetStateAction } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/firebase/client/config"
import { User, updateEmail } from "firebase/auth"
import { authErrors, countryCodes } from "@/constants"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type Props = {
    user: UserType,
    setLoading: Dispatch<SetStateAction<boolean>>,
    setSuccess: Dispatch<SetStateAction<string>>,
    setError: Dispatch<SetStateAction<string>>,
}

export default function PersonalInformation({ user, setError, setLoading, setSuccess }: Props) 
{
    const router = useRouter()

    const form = useForm<z.infer<typeof UserUpdateProfileSchema>>({
        resolver: zodResolver(UserUpdateProfileSchema),
        defaultValues: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            countryCode: user.countryCode,
            phoneNumber: user.phoneNumber,
            id: user.id
        },
    })

    const handlePhoneNumberChage = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const value = e.target.value
        onChange(value.replace(/[^\d]/g, ''))
    }

    const onSubmit = async (values: z.infer<typeof UserUpdateProfileSchema>) => {
        setLoading(true)
        try
        {
            await updateDoc(doc(db, 'users', user?.id ?? ''), {...values})
            const currentUser = auth.currentUser
            await updateEmail(currentUser as User, values.email)
            setLoading(false)
            setSuccess('Profile Updated Successfully! ✔')
            router.refresh()
        }
        catch(e: any)
        {
            console.log(e.message)
            //@ts-expect-error authError
            if(e.code !== 'auth/cancelled-popup-request') setError(Object.keys(authErrors).includes(e.code) ? authErrors[e.code] : 'Something Went Wrong!')   
        }
        finally
        {
            setLoading(false)
        }
    }
    
    const unChanged = [form.getValues().firstname === user.firstname, form.getValues().lastname === user.lastname, form.getValues().email === user.email, form.getValues().countryCode === user.countryCode, form.getValues().phoneNumber === user.phoneNumber].every(Boolean)
    
    return (
        <div className='flex flex-1 flex-col space-y-10 justify-center items-center'>
            <p className='mb-4 font-poppins text-white font-medium'>Account details</p>
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
                    <button disabled={unChanged} type="submit" className={cn('rounded-md font-light py-5 px-10 w-full text-white font-poppins', unChanged ? 'bg-[#878787]' : 'cursor-pointer bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%]')}>Confirm Changes</button>
                </form>
            </Form>
        </div>
    )
}