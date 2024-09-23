import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'

type EventTicket = {
    eventId: string,
    selectedTickets: { [key: string]: number },
    selectedSeats: { [key: string]: string },
    confirmedSeats: { [key: string]: string },
    purchasedTickets: { [key: string]: number },
    purchasedParkingPass: number,
}

type EventTicketStore = {
    eventTickets: EventTicket[],
    updateEvent: (updatedEvent: EventTicket) => void,
    addEvent: (event: EventTicket) => void,
}

// const useEventTicketsStore = create<EventTicketStore>(persist((set, get) => ({
//     eventTickets: [],
//     updateEvent: (updatedEvent: EventTicket) => {
//         set(({
//             eventTickets: get().eventTickets.map(eventTicket => {
//                 if(eventTicket.eventId === updatedEvent.eventId) return updatedEvent
//                 return eventTicket
//             })
//         }))
//     },
//     addEvent: (event: EventTicket) => {
//         set(({
//             eventTickets: [...get().eventTickets, event]
//         }))
//     },
// }), { name: 'eventTicketsStore', storage: createJSONStorage(() => sessionStorage) }))

const useEventTicketsStore = create<EventTicketStore, [["zustand/persist", unknown]]>(
    persist(
        (set, get) => ({
            eventTickets: [],
            updateEvent: (updatedEvent: EventTicket) => {
                set(({
                    eventTickets: get().eventTickets.map(eventTicket => {
                        if(eventTicket.eventId === updatedEvent.eventId) return updatedEvent
                        return eventTicket
                    })
                }))
            },
            addEvent: (event: EventTicket) => {
                set(({
                    eventTickets: [...get().eventTickets, event]
                }))
            },
        }),
        { name: 'eventTicketsStore', storage: createJSONStorage(() => sessionStorage) }
    )
)



export default useEventTicketsStore