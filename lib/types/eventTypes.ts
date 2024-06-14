export type Display = {
    id: string,
    createdAt: Date,
    description: string,
    descriptionArabic: string,
    display: string,
    displayArabic: string,
    events: string[]
}

export type EventType = {
    id: string,
    categoryID: string,
    city: string,
    cityArabic: string,
    country: string,
    createdAt: Date,
    description: string,
    descriptionArabic: string,
    displayID: string,
    displayPageImage: string,
    eventDate: Date,
    eventDisclaimers: {
        disclaimer: string,
        disclaimerArabic: string,
        icon: string
    }[],
    eventPageImage: string,
    eventTime: Date,
    gatesClose: Date | null,
    gatesOpen: Date | null,
    mapImage: string,
    name: string,
    nameArabic: string,
    seatPattern: { [key: string]: string },
    seated: boolean,
    tickets: {
        name: string,
        nameArabic: string,
        parkingPass: string,
        price: number,
        quantity: number
    }[],
    timeZone: string,
    venue: string,
    venueArabic: string,
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
    categoryArabic: string,
    color: number,
    events: string[],
}