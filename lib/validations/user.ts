import * as z from 'zod'
import { db } from '@/firebase/client/config'
import { collection, query, where, getDocs, and } from 'firebase/firestore'
import { countryCodes } from '@/constants'

export const UserSignUpSchema = z.object({
    firstname: z.string().min(2, { message: 'First name must be more than 1 character' }).max(255),
    lastname: z.string().min(2, { message: 'Last name must be more than 1 character' }).max(255),
    email: z.string().email({ message: 'Invalid email' }).refine(async (email) => {
        const userCollection = collection(db, 'users')
        const userQuery = query(userCollection, where('email', '==', email))
        const userSnapshot = await getDocs(userQuery)
        if(userSnapshot.size > 0) {
            return false
        }
        return true
    }, { message: 'Email already exists' }),
    countryCode: z.enum(countryCodes),
    phoneNumber: z.string().min(10, { message: 'Invalid phone number' })
        .refine(value => /^\d+$/.test(value), { message: 'Invalid phone number' }).transform(value => value.replace('/[^\d]/g', ''))
        .refine(async (phoneNumber) => {
            const userCollection = collection(db, 'users')
            const userQuery = query(userCollection, where('phoneNumber', '==', phoneNumber))
            const userSnapshot = await getDocs(userQuery)
            if(userSnapshot.size > 0) {
                return false
            }
            return true
        }, { message: 'Phone number already exists' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})
.refine(context => context.password === context.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] })

export const UserSignInSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }).refine(async (email) => {
        const userCollection = collection(db, 'users')
        const userQuery = query(userCollection, and(where('email', '==', email), where('provider', '==', 'credentials')))
        const userSnapshot = await getDocs(userQuery)
        if(userSnapshot.size === 0) {
            return false
        }
        return true
    }, { message: 'Email does not exist' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})

export const UserCompleteProfileSchema = z.object({
    firstname: z.string().min(2, { message: 'First name must be more than 1 character' }).max(255),
    lastname: z.string().min(2, { message: 'Last name must be more than 1 character' }).max(255),
    countryCode: z.enum(countryCodes),
    phoneNumber: z.string().min(10, { message: 'Invalid phone number' })
        .refine(value => /^\d+$/.test(value), { message: 'Invalid phone number' }).transform(value => value.replace('/[^\d]/g', ''))
        .refine(async (phoneNumber) => {
            const userCollection = collection(db, 'users')
            const userQuery = query(userCollection, where('phoneNumber', '==', phoneNumber))
            const userSnapshot = await getDocs(userQuery)
            if(userSnapshot.size > 0) {
                return false
            }
            return true
        }, { message: 'Phone number already exists' }),
})

export const UserUpdateProfileSchema = z.object({
    firstname: z.string().min(2, { message: 'First name must be more than 1 character' }).max(255),
    lastname: z.string().min(2, { message: 'Last name must be more than 1 character' }).max(255),
    countryCode: z.enum(countryCodes),
    email: z.string().email({ message: 'Invalid email' }),
    phoneNumber: z.string().min(10, { message: 'Invalid phone number' })
        .refine(value => /^\d+$/.test(value), { message: 'Invalid phone number' }).transform(value => value.replace('/[^\d]/g', '')),
    id: z.string(),
})
.refine(async (values) => {
    const userCollection = collection(db, 'users')
    const userQuery = query(userCollection, where('phoneNumber', '==', values.phoneNumber))
    const userSnapshot = await getDocs(userQuery)
    if(userSnapshot.size > 0 && userSnapshot.docs.find(doc => doc.id !== values?.id)?.exists()) {
        return false
    }
    return true
}, { message: 'Phone number already exists', path: ['phoneNumber'] })
.refine(async (values) => {
    const userCollection = collection(db, 'users')
    const userQuery = query(userCollection, where('email', '==', values.email))
    const userSnapshot = await getDocs(userQuery)
    if(userSnapshot.size > 0 && userSnapshot.docs.find(doc => doc.id !== values.id)?.exists()) {
        return false
    }
    return true
}, { message: 'Email already exists', path: ['email'] })

