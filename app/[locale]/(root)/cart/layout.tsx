import PromoContextProvider from "@/providers/PromoCodeProvider";

export default function CartLayout({ children }: { children: React.ReactNode })
{
    return (
        <PromoContextProvider>
            {children}
        </PromoContextProvider>
    )
}