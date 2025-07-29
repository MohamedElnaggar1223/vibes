export type UserType = {
    id?: string,
    countryCode?: string,
    email: string,
    firstname: string,
    lastname: string,
    phoneNumber?: string,
    verified: boolean,
    provider: string,
    profilePicture?: string,
    tickets: string[] | undefined
    cart?: {
        tickets: string[],
        createdAt: Date,
        status: 'pending' | 'paid' | 'inprogress'
    }
}