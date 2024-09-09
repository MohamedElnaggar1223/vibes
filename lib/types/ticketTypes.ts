export type TicketType = {
    country: string,
    createdAt: Date,
    eventId: string,
    id: string,
    parkingPass: number,
    seats: {},
    tickets: {
        [x: string]: number
    },
    totalPaid: number,
    userId: string,
    status: 'pending' | 'paid'
    sentMail: boolean | undefined
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