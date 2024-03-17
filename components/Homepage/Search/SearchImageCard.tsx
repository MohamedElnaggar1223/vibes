'use client'

import Image from "next/image"
import { useState } from "react"

type Props = {
    name: string,
    eventPageImage: string,
}

export default function SearchImageCard({ name, eventPageImage }: Props)
{
    const [loaded, setLoaded] = useState(false)

    return (
        <>
            {loaded ? (
                <Image
                    src={eventPageImage}
                    width={192} 
                    height={192} 
                    alt={name}
                    className='object-cover min-w-48 min-h-48 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out rounded-lg'
                    onLoad={() => setLoaded(true)}
                />
            ) : (
                <div className='bg-[#3F3F3F] min-w-48 min-h-48 animate-pulse rounded-lg' />
            )}
        </>
    )
}