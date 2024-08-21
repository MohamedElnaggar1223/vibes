import { unstable_flag as flag } from '@vercel/flags/next'

export const allowFacebookLogin = flag({
    key: 'allow-facebook-login',
    description: 'Allow users to login with Facebook',
    defaultValue: false,
    decide: async () => {
        const response = await fetch('https://flagsvibes.s3.eu-west-3.amazonaws.com/flags.json')
        const flags = await response.json()
        return flags["facebookLogin"]
    },
})

export const precompileFlags = [allowFacebookLogin] as const