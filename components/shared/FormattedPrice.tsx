'use client'

import useCountry from "@/hooks/useCountry"
import { ExchangeRate } from "@/lib/types/eventTypes"
import { Loader2 } from "lucide-react"
import { useMemo } from "react"

type Props = {
    price: number,
    exchangeRate: ExchangeRate
}

export default function FormattedPrice({ price, exchangeRate }: Props) {
    const { country } = useCountry()

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