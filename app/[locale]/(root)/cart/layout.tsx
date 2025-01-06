import PromoContextProvider from "@/providers/PromoCodeProvider";
import { headers } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function CartLayout({ children }: { children: React.ReactNode }) {
    noStore()
    headers()

    return (
        <PromoContextProvider>
            {children}
        </PromoContextProvider>
    )
}