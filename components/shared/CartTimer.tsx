'use client'

import { toArabicNums } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

type Props = {
    createdAt: Date
}

export default function CartTimer({ createdAt }: Props) 
{
    const router = useRouter()
    const pathname = usePathname()

    const calculateTimeLeft = () => {
        const TEN_MINUTES_IN_MS = 10 * 60 * 1000
        const currentTime = new Date().getTime()
        const createdAtTime = new Date(createdAt).getTime() + TEN_MINUTES_IN_MS
        const difference = createdAtTime - currentTime

        if (difference <= 0) {
            return { expired: true }
        }

        const remainingSeconds = Math.floor(difference / 1000)

        return { remainingSeconds }
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft())
            if(calculateTimeLeft().expired) router.refresh()
        }, 1000)

        return () => clearTimeout(timer)
    })

    const minutes = useMemo(() => Math.floor((timeLeft.remainingSeconds ?? 0) / 60), [timeLeft])
    const seconds = useMemo(() => Math.floor((timeLeft.remainingSeconds ?? 0) % 60), [timeLeft])

    return (
        <p className='font-poppins text-white font-normal text-sm lg:text-base'>{" "}{pathname?.startsWith('/ar') ? toArabicNums(`${minutes}`) : minutes}:{pathname?.startsWith('/ar') ? toArabicNums(seconds.toString().padStart(2, '0')) : seconds.toString().padStart(2, '0')}</p>
    )
}