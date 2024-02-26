import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase/client/config'

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/sign-in'
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials): Promise<any> {
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
        })
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            console.log('jwt', token, account, profile)
            return token
        },
        async session({ session, token, user }) {
            console.log('test')
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