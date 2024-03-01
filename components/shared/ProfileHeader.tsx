'use client'
import { cn } from "@/lib/utils";
import { SelectTrigger, SelectValue } from "../ui/select";
import { usePathname } from "next/navigation";

export default function ProfileHeader()
{
    const pathname = usePathname()

    return (
        <SelectTrigger className={cn("w-[140px] border-none bg-transparent text-white font-poppins text-base font-medium z-[999999] outline-none", pathname === '/profile' && 'profile-span')}>
            <SelectValue placeholder="Profile" />
        </SelectTrigger>
    )
}