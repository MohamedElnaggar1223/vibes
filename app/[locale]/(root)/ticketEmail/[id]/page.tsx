import TicketEmail from "@/components/pdf/TicketEmail";
import { getEvent } from "@/lib/utils";
import { render } from "@react-email/render";

type Props = {
    params: {
        id: string
    }
}

export default async function Ticket({ params }: Props)
{
    const event = await getEvent(params.id);

    return render(<TicketEmail event={event!} />)
}