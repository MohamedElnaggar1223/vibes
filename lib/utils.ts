import { initAdmin } from "@/firebase/server/config";
import { type ClassValue, clsx } from "clsx"
import { cache } from "react";
import { twMerge } from "tailwind-merge"
import { Category, EventType, ExchangeRate } from "./types/eventTypes";
import { Resource, createInstance, i18n } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { i18nConfig } from '@/i18nConfig';
import { PromoCode, TicketType } from "./types/ticketTypes";
import { UserType } from "./types/userTypes";

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

export const getEvent = cache(async (id: string) => {
    const admin = await initAdmin()
    const event = (await admin.firestore().collection('events').doc(id).get())

    if(event === undefined) return null
    return {
        ...event.data(),
        createdAt: event.data()?.createdAt.toDate(),
        eventTime: event.data()?.eventTime.toDate(),
        eventDate: event.data()?.eventDate.toDate(),
        updatedAt: event.data()?.updatedAt?.toDate(),
        gatesClose: event.data()?.gatesClose?.toDate(),
        gatesOpen: event.data()?.gatesOpen?.toDate(),
    } as EventType

})

export const getCategory = cache(async (id: string) => {
    const admin = await initAdmin()
    const category = (await admin.firestore().collection('categories').doc(id).get()).data() as Category

    return category
})

export const getCart = async (id: string) => {
    const admin = await initAdmin()
    const user = (await admin.firestore().collection('users').doc(id).get()).data()
    const userClient = {...user, cart: user?.cart && user?.cart.tickets.length ? {...user.cart, createdAt: user.cart?.createdAt?.toDate()} : undefined}

    const userCart = (userClient as UserType)?.cart

    const cart = userCart?.tickets?.map(async (ticketId: string) => {
        const ticket = (await admin.firestore().collection('tickets').doc(ticketId).get()).data()
        return {...ticket, createdAt: ticket?.createdAt.toDate()}
    })

    const cartTickets = (await Promise.all(cart || [])) as TicketType[]

    const cartTicketsSorted = cartTickets.sort((a, b) => {
        return a.createdAt.getTime() - b.createdAt.getTime()
    })

    return {...userCart, tickets: cartTicketsSorted}
}

export const getPromoCodes = async () => {
    const admin = await initAdmin()
    const promoCodes = (await admin.firestore().collection('promoCodes').get()).docs.map(doc => ({...doc.data(), createdAt: doc.data().createdAt.toDate()}))

    return promoCodes as PromoCode[]
}

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

export const toArabicDate = (date: string) => {
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
    '.': '.', // Decimal point remains the same
    January: 'يناير',
    February: 'فبراير',
    March: 'مارس',
    April: 'أبريل',
    May: 'مايو',
    June: 'يونيو',
    July: 'يوليو',
    August: 'أغسطس',
    September: 'سبتمبر',
    October: 'أكتوبر',
    November: 'نوفمبر',
    December: 'ديسمبر',
    th: 'هـ',
    st: 'الأول',
    nd: 'الثاني',
    rd: 'الثالث'
  };

  // Split the text based on commas (assuming price format or date separators)
  const parts = date.split(',');

  // Handle potential errors (e.g., non-numeric characters, invalid date format)
  // Convert based on the number of parts
  let convertedText = '';
  if (parts.length === 1) {
    // Price format: convert digits
    //@ts-expect-error dates
    convertedText = parts[0].split('').map((char) => englishToArabicMap[char]).join('');
  } else if (parts.length === 3) {
    // Date format: convert month, day, and year
    //@ts-expect-error dates
    const month = englishToArabicMap[parts[0].trim()];
    //@ts-expect-error dates
    const day = parts[1].trim().replace(/(th|st|nd|rd)$/, '').split('').map((char) => englishToArabicMap[char]).join('');
    //@ts-expect-error dates
    const year = parts[2].split('').map((char) => englishToArabicMap[char]).join('')
    convertedText = `${month} ${day}, ${year}`;
  } else {
    throw new Error('Invalid text format.');
  }

  return convertedText;
}

export const toArabicTime = (time: string) => {
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
    ':': ':',
    'PM': 'م',
    'AM': 'ص'
  }
  //@ts-expect-error num
  return time.split('').map((char) => englishToArabicMap[char]).join('')
}

export const convertArgbToHex = (argbValue: number) => {
  if (typeof argbValue !== 'number' || argbValue < 0 || argbValue > 4294967295) {
    return null; // Handle invalid input
  }

  const alpha = (argbValue >> 24) & 0xff;
  const red = (argbValue >> 16) & 0xff;
  const green = (argbValue >> 8) & 0xff;
  const blue = argbValue & 0xff;

  const hexColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;

  return alpha !== 0xff ? `rgba(${red}, ${green}, ${blue}, ${alpha / 255})` : hexColor;
}