import { initAdmin } from "@/firebase/server/config";
import { type ClassValue, clsx } from "clsx"
import { cache } from "react";
import { twMerge } from "tailwind-merge"
import { ExchangeRate } from "./types/eventTypes";

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