export type Hotel = {
    name: string,
    website: string,
    address: string,
    zipCode: string,
    roomType: string,
    boardType: string,
    date: {
        from: Date,
        to: Date
    },
    adults: number,
    children: number,
    bookingMethod: string,
    countryCode: string,
    email: string,
    fullName: string,
    itineraryNumber: string,
    phoneNumber: string,
    price: number
    userId: string
    status: 'pending' | 'sold' | 'cancelled' | 'onSale'
    proof: string
    id: string
    country: string
}