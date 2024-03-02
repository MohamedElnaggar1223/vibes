import { UserType } from "@/lib/types/userTypes"
import { Suspense } from "react"
import Loading from "./Loading"

type Props = {
    user: UserType
}

export default async function PastTickets({ user }: Props)
{
    const myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Promise resolved after 3 seconds');
        }, 3000);
    });

    await myPromise

    return (
        <Suspense fallback={<Loading />}>
            
        </Suspense>
    )
}