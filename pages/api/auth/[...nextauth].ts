import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase/client/config'
import { initAdmin } from '../../../firebase/server/config'

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/sign-in'
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials): Promise<any> {
                if((credentials as any).provider === 'google')
                {
                    const admin = await initAdmin()
                    const userDoc = admin.firestore().collection('users').doc((credentials as any).id)
                    const userData = await userDoc.get()

                    if(userData.exists) {
                        await userDoc.update({ provider: 'google' })
                    } else {
                        await userDoc.set({ 
                            email: (credentials as any).email, 
                            provider: 'google', 
                            verified: false, 
                            firstname: ((credentials as any).name as string).split(" ")[0] ?? '', 
                            lastname: ((credentials as any).name as string).split(" ")[1] ?? '', 
                            countryCode: '', 
                            phoneNumber: '', 
                            id: (credentials as any).id, 
                            tickets: [], 
                            image: (credentials as any).image 
                        })
                    }

                    return { email: (credentials as any).email, id: (credentials as any).id}
                }
                else if ((credentials as any).provider === 'twitter')
                {
                    const admin = await initAdmin()
                    const userDoc = admin.firestore().collection('users').doc((credentials as any).id)
                    const userData = await userDoc.get()

                    if(userData.exists) {
                        await userDoc.update({ provider: 'twitter' })
                    } else {
                        await userDoc.set({ 
                            email: (credentials as any).email, 
                            provider: 'twitter', 
                            verified: false, 
                            firstname: ((credentials as any).name as string).split(" ")[0] ?? '', 
                            lastname: ((credentials as any).name as string).split(" ")[1] ?? '', 
                            countryCode: '', 
                            phoneNumber: '', 
                            id: (credentials as any).id, 
                            tickets: [] 
                        })
                    }

                    return { email: (credentials as any).email, id: (credentials as any).id}
                }
                else if ((credentials as any).provider === 'facebook')
                {
                    const admin = await initAdmin()
                    const userDoc = admin.firestore().collection('users').doc((credentials as any).id)
                    const userData = await userDoc.get()

                    if(userData.exists) {
                        await userDoc.update({ provider: 'facebook' })
                    } else {
                        await userDoc.set({ 
                            email: (credentials as any).email, 
                            provider: 'facebook', 
                            verified: false, 
                            firstname: ((credentials as any).name as string).split(" ")[0] ?? '', 
                            lastname: ((credentials as any).name as string).split(" ")[1] ?? '', 
                            countryCode: '', 
                            phoneNumber: '', 
                            id: (credentials as any).id, 
                            tickets: [] 
                        })
                    }

                    return { email: (credentials as any).email, id: (credentials as any).id}
                }
                else
                {
                    const data = await signInWithEmailAndPassword(auth, (credentials as any).email || '', (credentials as any).password || '')
                        .then(userCredential => {
                            if(userCredential.user) {
                                return { email: (credentials as any).email, id: (credentials as any).id}
                            }
                            return null
                        })
                        .catch(error => {
                            console.error(error)
                            return null
                        })
    
                    return data
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            return token
        },
        async session({ session, token, user }) {
            session.user.id = token.sub as string
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    }
}

export default NextAuth(authOptions)