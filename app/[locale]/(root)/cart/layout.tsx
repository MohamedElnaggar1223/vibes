export const dynamic = 'force-dynamic'
export const revalidate = 0
import PromoContextProvider from "@/providers/PromoCodeProvider";
import { headers } from "next/headers";

export default function CartLayout({ children }: { children: React.ReactNode }) {
    headers()

    return (
        <PromoContextProvider>
            {children}
        </PromoContextProvider>
    )
}