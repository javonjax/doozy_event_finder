import { EventCardData } from '../../../../schemas/schemas';
import { formatDate, formatTime } from '../utils/utils';
import EventLink from './EventLink';

const Event = ({ event, path }: { event: EventCardData; path: string }): React.JSX.Element => {
  const date: string = event.dates.start.localDate;
  const time: string = event.dates.start.localTime;

  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);

  const [dayOfWeek, monthDay] = formattedDate.split(',');

  return (
    <div className='flex items-center rounded-2xl mb-4 w-[95%] transform transition-all duration-400 hover:scale-105'>
      <div className='bg-[hsl(var(--background))] text-[hsl(var(--text-color))] flex items-center justify-center uppercase rounded-tl-xl rounded-bl-xl min-w-[125px] self-stretch'>
        <h2>{monthDay.trim()} </h2>
      </div>
      <div className='flex grow bg-neutral-500 rounded-tr-xl rounded-br-xl'>
        <div className='flex flex-col p-4 grow'>
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
        <div className='flex self-stretch items-center'>
          <EventLink event={event} path={path}></EventLink>
        </div>
      </div>
    </div>
  );
};

export default Event;
