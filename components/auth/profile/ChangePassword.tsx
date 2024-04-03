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
import { UserChangePasswordSchema } from "@/lib/validations/user"
import { Dispatch, SetStateAction, useState } from "react"
import { auth } from "@/firebase/client/config"
import { User, updatePassword } from "firebase/auth"
import { authErrors } from "@/constants"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

type Props = {
    user: UserType,
    setLoading: Dispatch<SetStateAction<boolean>>,
    setSuccess: Dispatch<SetStateAction<string>>,
    setError: Dispatch<SetStateAction<string>>,
}

export default function ChangePassword({ user, setError, setLoading, setSuccess }: Props) 
{
    const router = useRouter()

    const pathname = usePathname()

    const [oldPasswordVisible, setOldPasswordVisible] = useState(false)
    const [newPasswordVisible, setNewPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

    const form = useForm<z.infer<typeof UserChangePasswordSchema>>({
        resolver: zodResolver(UserChangePasswordSchema),
        defaultValues: {
            email: user.email,
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        },
    })

    const onSubmit = async (values: z.infer<typeof UserChangePasswordSchema>) => {
        setLoading(true)
        try
        {
            const currentUser = auth.currentUser
            await updatePassword(currentUser as User, values.newPassword)
            setLoading(false)
            setSuccess('Password Updated Successfully! ✔')
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
    
    return (
        <div className='flex flex-1 flex-col space-y-10 justify-center items-center'>
            <p className='mb-4 font-poppins text-white font-medium'>Change Password</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit space-y-10 flex flex-col justify-center items-center">
                    <FormField
                        control={form.control}
                        name="oldPassword"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormControl>
                                    <div className="relative">
                                        <input 
                                            placeholder="Old Password" 
                                            type={oldPasswordVisible ? 'text' : 'password'}
                                            className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-screen max-w-[412px] max-sm:max-w-[340px] outline-none rounded-md'
                                            {...field}
                                        />
                                        {oldPasswordVisible ? (
                                            <Eye 
                                                className={cn('absolute top-[32%] z-50 cursor-pointer', pathname?.includes('ar') ? 'left-[5%]' : 'left-[90%]')} 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setOldPasswordVisible(prev => !prev)
                                                }} 
                                            />
                                        ) : (
                                            <EyeOff 
                                                className={cn('absolute top-[32%] z-50 cursor-pointer', pathname?.includes('ar') ? 'left-[5%]' : 'left-[90%]')} 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setOldPasswordVisible(prev => !prev)
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
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormControl>
                                    <div className="relative">
                                        <input 
                                            placeholder="New Password" 
                                            type={newPasswordVisible ? 'text' : 'password'}
                                            className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-screen max-w-[412px] max-sm:max-w-[340px] outline-none rounded-md'
                                            {...field}
                                        />
                                        {newPasswordVisible ? (
                                            <Eye 
                                                className={cn('absolute top-[32%] z-50 cursor-pointer', pathname?.includes('ar') ? 'left-[5%]' : 'left-[90%]')} 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setNewPasswordVisible(prev => !prev)
                                                }} 
                                            />
                                        ) : (
                                            <EyeOff 
                                                className={cn('absolute top-[32%] z-50 cursor-pointer', pathname?.includes('ar') ? 'left-[5%]' : 'left-[90%]')} 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setNewPasswordVisible(prev => !prev)
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
                        name="confirmNewPassword"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormControl>
                                    <div className="relative">
                                        <input 
                                            placeholder="New Password" 
                                            type={confirmPasswordVisible ? 'text' : 'password'}
                                            className='placeholder:text-[rgba(0,0,0,0.5)] font-poppins py-5 text-base px-10 w-screen max-w-[412px] max-sm:max-w-[340px] outline-none rounded-md'
                                            {...field}
                                        />
                                        {confirmPasswordVisible ? (
                                            <Eye 
                                                className={cn('absolute top-[32%] z-50 cursor-pointer', pathname?.includes('ar') ? 'left-[5%]' : 'left-[90%]')} 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setConfirmPasswordVisible(prev => !prev)
                                                }} 
                                            />
                                        ) : (
                                            <EyeOff 
                                                className={cn('absolute top-[32%] z-50 cursor-pointer', pathname?.includes('ar') ? 'left-[5%]' : 'left-[90%]')} 
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
                    <button type="submit" className={cn('cursor-pointer bg-gradient-to-r from-[#E72377] from-[-5.87%] to-[#EB5E1B] to-[101.65%] rounded-md font-light py-5 px-10 w-full text-white font-poppins')}>Confirm Changes</button>
                </form>
            </Form>
        </div>
    )
}