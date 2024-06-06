'use client'
import { PromoCode } from "@/lib/types/ticketTypes";
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";

export type PromoContextType = { 
    promoCodes: PromoCode[] | undefined; 
    promoCode: string | undefined;
    promoCodeApplied: boolean
    setPromoCode: Dispatch<SetStateAction<string | undefined>> 
    setPromoCodes: Dispatch<SetStateAction<PromoCode[] | undefined>>
    setPromoCodeApplied: Dispatch<SetStateAction<boolean>>
} | null

export const PromoContext = createContext<PromoContextType>(null)

export default function PromoContextProvider({ children }: { children: React.ReactNode}) 
{
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>()
    const [promoCode, setPromoCode] = useState<string>()
    const [promoCodeApplied, setPromoCodeApplied] = useState(false)

    return (
        <PromoContext.Provider value={{ promoCodes, promoCode, promoCodeApplied, setPromoCode, setPromoCodes, setPromoCodeApplied }}>
            {children}
        </PromoContext.Provider>
    )
}