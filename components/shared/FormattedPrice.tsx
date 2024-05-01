'use client'

import { ExchangeRate } from "@/lib/types/eventTypes"
import { toArabicNums } from "@/lib/utils"
import { CountryContext } from "@/providers/CountryProvider"
import { Loader2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useContext, useMemo } from "react"
import { useTranslation } from "react-i18next"

type Props = {
    price: number,
    exchangeRate: ExchangeRate
    currency?: string
}

export default function FormattedPrice({ price, exchangeRate, currency }: Props) {
    const context = useContext(CountryContext)
    if(!context) return <Loader2 className='animate-spin' />
    const { country } = context

    const { t } = useTranslation()
    const pathname = usePathname()

    const selectedExchangeRate = useMemo(() => {
        if(currency)
        {
            if(currency === 'EGP') return exchangeRate.USDToEGP
            else if(currency === 'SAR') return exchangeRate.USDToSAR
            else return exchangeRate.USDToAED
        }
        if(country === 'EGP') return exchangeRate.USDToEGP
        else if(country === 'SAR') return exchangeRate.USDToSAR
        else return exchangeRate.USDToAED
    }, [country])

    return (
        <>
        
         {
            country ?
            `${pathname?.includes("/ar") ? toArabicNums(((price ?? 0) * selectedExchangeRate).toLocaleString()) : ((price ?? 0) * selectedExchangeRate).toLocaleString()} ${t(`common:${country}`) ?? t(`common:AED`)}` :
            <Loader2 className='animate-spin' />
        }
        </>
    )
}