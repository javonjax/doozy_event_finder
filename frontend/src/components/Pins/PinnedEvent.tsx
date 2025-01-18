import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { Ticket, PinOff } from "lucide-react";
import { PinnedEventData } from "../../../../schemas/schemas";
import { formatDate, formatTime } from "../utils/utils";
import { NavLink } from "react-router-dom";

export interface PinnedEventProps {
  event: PinnedEventData;
  handleUnpin: (event: PinnedEventData) => Promise<void>;
}

const PinnedEvent = ({ event, handleUnpin }: PinnedEventProps) => {
  return (
    <DropdownMenu key={event.id} modal={false}>
      <DropdownMenuTrigger className="text-wrap rounded-2xl p-4 text-[hsl(var(--text-color))] hover:bg-white hover:text-black">
        {event.event_name}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        data-state={"closed"}
        className="z-10 flex w-fit max-w-[350px] flex-col items-center rounded-2xl border-[1px] border-white bg-black p-4 text-[hsl(var(--text-color))]"
      >
        <img src={event.img_url} />
        <div className="my-2 text-center">{event.event_name}</div>
        <div>
          {formatDate(event.event_date)}, {formatTime(event.event_time)}
        </div>
        <div className="m-2 flex">
          <NavLink
            className="m-2 flex min-w-[70px] items-center justify-center rounded-2xl border-[1px] border-white p-3 hover:bg-white hover:text-black"
            to={`/${event.event_category.toLowerCase()}/${event.event_id}`}
          >
            Info
          </NavLink>
          <a
            href={event.ticket_url}
            target="_blank"
            className="m-2 flex items-center justify-center rounded-2xl border-[1px] border-orange-400 p-3 hover:bg-white hover:text-black"
          >
            <Ticket className="-rotate-45 text-orange-400" />
          </a>
        </div>
        <button
          className="m-2 flex min-w-[70px] items-center justify-center rounded-2xl border-[1px] border-white p-3 text-red-500 hover:bg-white"
          onClick={() => handleUnpin(event)}
        >
          <PinOff />
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PinnedEvent;
