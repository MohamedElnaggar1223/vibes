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
    gatesClose: string | null,
    gatesOpen: string | null,
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
    updatedAt: Date,
    venue: string
}