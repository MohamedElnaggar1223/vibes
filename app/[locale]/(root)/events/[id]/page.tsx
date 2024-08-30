import { EventType } from "@/lib/types/eventTypes"
import { getEvents } from "@/lib/utils"
import EventPageContainer from "./event-page-container"

export const revalidate = 60
 
export const dynamicParams = true
 
export async function generateStaticParams() {
  let events: EventType[] = await getEvents()

  return events.map((event) => ({
        id: event.id,
  }))
}

export default function Page({ params }: { params: { id: string } }) 
{
    return <EventPageContainer params={params} />
}