import { Pin, PinOff } from "lucide-react";
import { EventCardData } from "../../../../schemas/schemas";
import { formatDate, formatTime } from "../utils/utils";
import EventLink from "./EventLink";

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
  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);
  const [dayOfWeek, monthDay] = formattedDate.split(",");

  return (
    <div className="flex flex-col md:flex-row items-center rounded-2xl mb-4 w-[95%]  ">
      <div className="flex items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--text-color))] uppercase rounded-tl-xl rounded-tr-xl md:rounded-tr-none md:rounded-bl-xl min-w-[125px] self-stretch p-4">
        <h2>{monthDay.trim()}</h2>
      </div>
      <div className="flex flex-col md:flex-row items-center grow bg-neutral-500 w-full rounded-bl-xl rounded-br-xl md:rounded-bl-none md:rounded-tr-xl pb-4 md:p-0">
        <div className="flex flex-col m-4 grow text-center md:text-start">
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
          <div className="flex md:self-stretch items-center">
            <EventLink event={event} path={path}></EventLink>
          </div>
          <div className={`flex md:self-stretch items-center`}>
            <button
              className={`flex justify-center items-center mr-4 min-w-[46px] bg-[hsl(var(--background))] 
                ${pinned ? "text-red-500" : "text-[hsl(var(--text-color))] hover:text-[hsl(var(--background))] hover:bg-[hsl(var(--text-color))] hover:scale-125"} p-2 rounded-2xl h-fit transform transition-all duration-400`}
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
