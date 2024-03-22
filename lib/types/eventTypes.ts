export type Display = {
    id: string,
    createdAt: Date,
    description: string,
    display: string,
    events: string[]
}

export type EventType = {
    id: string,
    categoryID: string,
    city: string,
    country: string,
    createdAt: Date,
    description: string,
    displayID: string,
    displayPageImage: string,
    eventDate: Date,
    eventDisclaimers: {
        disclaimer: string,
        icon: string
    }[],
    eventPageImage: string,
    eventTime: Date,
    gatesClose: Date | null,
    gatesOpen: Date | null,
    mapImage: string,
    name: string,
    seated: boolean,
    tickets: {
        name: string,
        parkingPass: string,
        price: number,
        quantity: number
    }[],
    timeZone: string,
    venue: string,
    parkingPass: {
        price: number,
        quantity: number
    },
    ticketsSold: {},
    totalRevenue: number,
    parkingSold: number,
    updatedAt?: Date,
    uploadedTickets: boolean,
    ticketFilesPath: string,
}

export type ExchangeRate = {
    id: string,
    USDToSAR: number,
    USDToAED: number,
    USDToEGP: number,
    updatedAt: Date,
}

export type Category = {
    id: string,
    createdAt: Date,
    category: string,
    color: number,
    events: string[],
}