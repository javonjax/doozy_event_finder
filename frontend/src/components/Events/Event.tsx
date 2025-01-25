import { Pin, PinOff } from "lucide-react";
import { EventCardData } from "../../../../schemas/schemas";
import { formatDate, formatTime } from "../utils/utils";
import EventInfoLink from "./EventInfoLink";

export interface EventProps {
  event: EventCardData;
  path: string;
  handlePin: (event: EventCardData) => void;
  handleUnpin: (event: EventCardData) => void;
  pinned: boolean;
}

// Event cards that form the EventList.
const Event = ({
  event,
  path,
  handlePin,
  handleUnpin,
  pinned,
}: EventProps): React.JSX.Element => {
  const date: string = event.dates.start.localDate;
  const time: string = event.dates.start.localTime;
  const formattedDate: string = formatDate(date);
  const formattedTime: string = formatTime(time);
  const [dayOfWeek, monthDay]: Array<string> = formattedDate.split(",");

  return (
    <div className="mb-4 flex w-[95%] flex-col items-center rounded-2xl md:flex-row">
      <div className="flex min-w-[125px] items-center justify-center self-stretch rounded-tl-xl rounded-tr-xl bg-[hsl(var(--background))] p-4 uppercase text-[hsl(var(--text-color))] md:rounded-bl-xl md:rounded-tr-none">
        <h2>{monthDay.trim()}</h2>
      </div>
      <div className="flex w-full grow flex-col items-center rounded-bl-xl rounded-br-xl bg-neutral-500 pb-4 md:flex-row md:rounded-bl-none md:rounded-tr-xl md:p-0">
        <div className="m-4 flex grow flex-col text-center md:text-start">
          <div>
            {dayOfWeek.trim()} - {formattedTime}
          </div>
          <div>{event.name}</div>
          <div>
            {`${event._embedded.venues[0].city.name}, ${
              event._embedded.venues[0].state.stateCode ||
              event._embedded.venues[0].state.name
            }`}
          </div>
        </div>
        <div className="flex">
          <div className="flex items-center md:self-stretch">
            <EventInfoLink event={event} path={path}></EventInfoLink>
          </div>
          <div className={`flex items-center md:self-stretch`}>
            <button
              className={`mr-4 flex min-w-[46px] items-center justify-center bg-[hsl(var(--background))] ${pinned ? "text-red-500" : "text-[hsl(var(--text-color))] hover:scale-125 hover:bg-[hsl(var(--text-color))] hover:text-[hsl(var(--background))]"} duration-400 h-fit transform rounded-2xl p-2 transition-all`}
              onClick={
                pinned ? () => handleUnpin(event) : () => handlePin(event)
              }
            >
              {pinned ? <PinOff /> : <Pin className="-rotate-45" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
