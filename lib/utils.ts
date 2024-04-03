import { initAdmin } from "@/firebase/server/config";
import { type ClassValue, clsx } from "clsx"
import { cache } from "react";
import { twMerge } from "tailwind-merge"
import { Category, EventType, ExchangeRate } from "./types/eventTypes";
import { Resource, createInstance, i18n } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { i18nConfig } from '@/i18nConfig';

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

export async function initTranslations(
  locale: string,
  namespaces: string[],
  i18nInstance?: i18n,
  resources?: Resource
) {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        //@ts-expect-error lang
        (language, namespace) =>
          import(`@/locales/${language}/${namespace}.json`)
      )
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : i18nConfig.locales
  });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t
  };
}

export const toArabicNums = (price: string) => {
  const englishToArabicMap = {
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
    '.': '.'
  }
  //@ts-expect-error num
  return price.replace(/[0-9]/g, num => englishToArabicMap[num])
}