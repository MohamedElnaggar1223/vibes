'use client'

import useCountry from "@/hooks/useCountry"
import { ExchangeRate } from "@/lib/types/eventTypes"
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
         {`${(price * selectedExchangeRate).toLocaleString()} ${country ?? 'AED'}`}
        </>
    )
}