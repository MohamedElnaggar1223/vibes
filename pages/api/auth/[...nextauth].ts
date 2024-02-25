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
                return await signInWithEmailAndPassword(auth, (credentials as any).email || '', (credentials as any).password || '')
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
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            token.id = token?.id
            return token
        },
        async session({ session, token }) {
            session.user.id = token?.id as string
            return session
        }
    }
}

export default NextAuth(authOptions)