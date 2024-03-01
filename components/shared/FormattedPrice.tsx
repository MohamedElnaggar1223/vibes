'use client'

import { ExchangeRate } from "@/lib/types/eventTypes"
import { CountryContext } from "@/providers/CountryProvider"
import { Loader2 } from "lucide-react"
import { useContext, useMemo } from "react"

type Props = {
    price: number,
    exchangeRate: ExchangeRate
}

export default function FormattedPrice({ price, exchangeRate }: Props) {
    const context = useContext(CountryContext)
    if(!context) return <Loader2 className='animate-spin' />
    const { country } = context

    const selectedExchangeRate = useMemo(() => {
        if(country === 'EGP') return exchangeRate.USDToEGP
        else if(country === 'SAR') return exchangeRate.USDToSAR
        else return exchangeRate.USDToAED
    }, [country])

    return (
        <>
        
         {
            country ?
            `${((price ?? 0) * selectedExchangeRate).toLocaleString()} ${country ?? 'AED'}` :
            <Loader2 className='animate-spin' />
        }
        </>
    )
}