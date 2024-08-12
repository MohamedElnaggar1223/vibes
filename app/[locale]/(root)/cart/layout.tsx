export const dynamic = 'force-dynamic'
export const revalidate = 0
import PromoContextProvider from "@/providers/PromoCodeProvider";

export default function CartLayout({ children }: { children: React.ReactNode })
{
    return (
        <PromoContextProvider>
            {children}
        </PromoContextProvider>
    )
}