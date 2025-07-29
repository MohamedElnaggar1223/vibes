import { EventType } from '@/lib/types/eventTypes'
import { cn } from '@/lib/utils'

type Props = {
    event: EventType
    className?: string
}

export default function EventBadges({ event, className }: Props) {
    const badges = []
    const currentDate = new Date()
    
    // Limited Tickets badge - if any ticket type has less than 10 available
    const hasLimitedTickets = event.tickets.some(ticket => ticket.quantity > 0 && ticket.quantity < 10)
    
    if (hasLimitedTickets) {
        badges.push({
            text: 'Limited Tickets',
            className: 'bg-red-500 text-white'
        })
    }
    
    // Closing Soon badge - less than a week left
    const oneWeekFromNow = new Date()
    oneWeekFromNow.setDate(currentDate.getDate() + 7)
    if (event.eventDate <= oneWeekFromNow && event.eventDate > currentDate) {
        badges.push({
            text: 'Closing Soon',
            className: 'bg-orange-500 text-white'
        })
    }
    
    // New badge - added in the past 14 days
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(currentDate.getDate() - 14)
    if (event.createdAt >= twoWeeksAgo) {
        badges.push({
            text: 'New',
            className: 'bg-green-500 text-white'
        })
    }
    
    if (badges.length === 0) return null
    
    return (
        <div className={cn('flex flex-wrap gap-1', className)}>
            {badges.map((badge, index) => (
                <span
                    key={index}
                    className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full shadow-sm',
                        badge.className
                    )}
                >
                    {badge.text}
                </span>
            ))}
        </div>
    )
} 