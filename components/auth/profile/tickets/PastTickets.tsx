import { UserType } from "@/lib/types/userTypes"
import { Suspense } from "react"
import Loading from "./TicketsLoading"

type Props = {
    user: UserType
}

export default function PastTickets({ user }: Props)
{

    return (
        <Suspense fallback={<Loading />}>
            
        </Suspense>
    )
}