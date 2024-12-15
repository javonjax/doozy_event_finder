import { EventCardData } from '../../../../schemas/schemas';
import { formatDate, formatTime } from '../utils/utils';
import EventLink from './EventLink';

const EventCard = ({ event, path }: { event: EventCardData; path: string }): React.JSX.Element => {
  const date: string = event.dates.start.localDate;
  const time: string = event.dates.start.localTime;

  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);

  const [dayOfWeek, monthDay] = formattedDate.split(',');

  return (
    <div className='flex items-center rounded-2xl mb-4 w-full border-2 border-black bg-neutral-500'>
      <div className='bg-[hsl(var(--background))] text-[hsl(var(--text-color))] flex items-center justify-center uppercase rounded-tl-xl rounded-bl-xl min-w-[125px] self-stretch'>
        <h2>{monthDay.trim()} </h2>
      </div>
      <div className='flex flex-col p-4 grow bg-neutral-500'>
        <div>
          {dayOfWeek.trim()} - {formattedTime}
        </div>
        <div>
          {event.name}
        </div>
        <div>
          {`${
            event._embedded.venues[0].city.name
          }, ${
            event._embedded.venues[0].state.stateCode ||
            event._embedded.venues[0].state.name
          }`}
        </div>
      </div>
      <EventLink
        event={event}
        path={path}>
      </EventLink>
    </div>
  );
};

export default EventCard;
