export type TicketType = {
    country: string,
    createdAt: Date,
    eventId: string,
    id: string,
    parkingPass: number,
    seats: {},
    tickets: any,
    totalPaid: number,
    userId: string,
    status: 'pending' | 'paid'
    forSale?: boolean
    salePrice?: number | string
    saleStatus?: 'pending' | 'sold' | 'cancelled' | 'onSale' | 'inEscrow'
    sentMail?: boolean
    bundleID?: string
}

export type PromoCode = {
    country: string,
    createdAt: Date,
    discount: number,
    eventID: string,
    id: string,
    promo: string,
    quantity: number,
    quantityUsed: number,
    singleEvent: boolean,
    type: '$' | '%'
}

export type Bundle = {
    id: string,
    eventId: string,
    createdAt: Date,
    price: number,
    status: 'pending' | 'sold' | 'cancelled' | 'onSale' | 'inEscrow'
    userId: string
    tickets: string[]
}

export type BundleWithTickets = {
    id: string,
    eventId: string,
    createdAt: Date,
    price: number,
    status: 'pending' | 'sold' | 'cancelled' | 'onSale' | 'inEscrow'
    userId: string
    tickets: TicketType[]
}