'use client'
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";

type ContextType = { country: string | undefined; setCountry: Dispatch<SetStateAction<string | undefined>> } | null

export const CountryContext = createContext<ContextType>(null)

export default function CountryContextProvider({ children }: { children: React.ReactNode}) 
{
    const [coordinates, setCoordinates] = useState<GeolocationCoordinates>()
    const [country, setCountry] = useState<string>()
    const [preferedCountry, setPreferedCountry] = useState<string | null>()

    useEffect(() => {
        if(localStorage.getItem('country')) setPreferedCountry(() => localStorage.getItem('country'))
        else setPreferedCountry(() => null)
    }, [coordinates])

    // useEffect(() => {
    //     setTimeout(() => {
    //         if(!(['EGP', 'AED', 'SAR'].includes(country ?? ''))) 
    //         {
    //             console.log(country)
    //             if(!(['EGP', 'AED', 'SAR'].includes(localStorage.getItem('country')!))) setCountry(() => 'AED')
    //             else setCountry(() => localStorage.getItem('country')!)
    //         }
    //     }, 5000)
    // }, [])

    // const currentLocation = useMemo(() => {
    //     return navigator.geolocation.getCurrentPosition((data) => setCountry(data.coords))
    // }, [])

    useEffect(() => {
        let mounted = false
        navigator.geolocation.getCurrentPosition((data) => {
            mounted = true
            setCoordinates(() => data.coords)
        })
        setTimeout(() => {
            if(mounted) return
            if(!(['EGP', 'AED', 'SAR'].includes(country ?? ''))) 
            {
                if(!(['EGP', 'AED', 'SAR'].includes(localStorage.getItem('country')!))) setCountry(() => 'AED')
                else setCountry(() => localStorage.getItem('country')!)
            }
        }, 5000)
    }, [])

    useEffect(() => {
        if(coordinates) 
        {
            // fetch(`http://api.geonames.org/countryCodeJSON?lat=${coordinates?.latitude}&lng=${coordinates?.longitude}&username=demo`, {
            //     method: "GET",
            //     headers: {
            //         "Accept": "application/json",
            //     }
            // })
            fetch('https://api.ipregistry.co/?key=440sw5smcozgnnm3')
            .then(response => response.json())
            .then(data => {
                setCountry(() => {
                    if(preferedCountry !== null) return preferedCountry
                    else return ['EGP', 'AED', 'SAR'].includes(data.currency.code) ? data.currency.code : 'AED'
                })
            })
        }
    }, [coordinates])
    
    // useEffect(() => {
    //     if (currentLocation !== null) {
    //         fetch(`http://api.geonames.org/countryCodeJSON?lat=${42}&lng=10.2&username=demo`, {
    //             method: "GET",
    //             headers: {
    //                 "Accept": "application/json",
    //             }
    //         }).then(response => response.json()).then(data => {
    //             setCountry(data.country)
    //         })
    //     }
    // }, [currentLocation])

    return (
        <CountryContext.Provider value={{ country, setCountry }}>
            {children}
        </CountryContext.Provider>
    )
}