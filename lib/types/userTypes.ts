export type UserType = {
    id?: string,
    countryCode?: string,
    email: string,
    firstname: string,
    lastname: string,
    phoneNumber?: string,
    verified: boolean,
    provider: string
}