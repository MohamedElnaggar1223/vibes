import { initAdmin } from "@/firebase/server/config";
import { type ClassValue, clsx } from "clsx"
import { cache } from "react";
import { twMerge } from "tailwind-merge"
import { Category, EventType, ExchangeRate } from "./types/eventTypes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDaySuffix(day: number) {
  if (day >= 11 && day <= 13) {
      return `${day}th`;
  }
  switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
  }
}

export const formatTime = (date: Date) => {
    let hours = date.getHours()
    let minutes = date.getMinutes().toString()

    let meridiem = "AM"
    if (hours > 12) {
        hours -= 12
        meridiem = "PM"
    }

    if (parseInt(minutes) < 10) {
        minutes = "0" + minutes
    }

    const formattedTime = hours + ":" + minutes + " " + meridiem

    return formattedTime
}

export const getExchangeRate = cache(async () => {
    const admin = await initAdmin()
    const exchangeRate = await (await admin.firestore().collection('rates').get()).docs.map(doc => ({...doc.data(), updatedAt: doc.data().updatedAt.toDate()}))[0] as ExchangeRate

    return exchangeRate
})

export const getCategories = cache(async () => {
    const admin = await initAdmin()
    const categories = (await admin.firestore().collection('categories').get())?.docs.map(doc => ({...doc.data(), id: doc.id, createdAt: doc.data().createdAt.toDate()})) as Category[]

    return categories
})

export const getEvents = cache(async () => {
    const admin = await initAdmin()
    const eventsData = (await admin.firestore().collection('events').get()).docs
    const eventsDocs = eventsData?.map(async (event) => {
        return {
            ...event.data(),
            createdAt: event.data()?.createdAt.toDate(),
            eventTime: event.data()?.eventTime.toDate(),
            eventDate: event.data()?.eventDate.toDate(),
            updatedAt: event.data()?.updatedAt?.toDate(),
        } as EventType

    })
    const events = await Promise.all(eventsDocs || [])

    return events
})