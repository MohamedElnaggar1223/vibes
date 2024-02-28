import { useEffect, useMemo, useState } from "react";

export default function useCountry() 
{
    const [coordinates, setCoordinates] = useState<GeolocationCoordinates>()
    const [country, setCountry] = useState<string>()

    // const currentLocation = useMemo(() => {
    //     return navigator.geolocation.getCurrentPosition((data) => setCountry(data.coords))
    // }, [])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((data) => setCoordinates(data.coords))
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
                setCountry(['EGP', 'AED', 'SAR'].includes(data.currency.code) ? data.currency.code : 'AED')
            })
        }
    }, [coordinates])

    console.log(country)

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

    return { country }
}