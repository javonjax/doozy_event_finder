import { EventCardData } from '../../../../schemas/schemas';
import { Link } from 'react-router-dom';

const Event = ({ event, path }: { event: EventCardData; path: string }) => {
  const date: string = event.dates.start.localDate;
  const time: string = event.dates.start.localTime;

  // Converts date from YYYY-MM-DD to Weekday, Month DD.
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return formattedDate;
  };

  // Converts time from 24hr to 12hr format.
  const formatTime = (timeString: string): string => {
    const [hours24, mins] = timeString.split(':');
    const period = Number(hours24) >= 12 ? 'PM' : 'AM';
    const hours = Number(hours24) % 12 || 12;
    const formattedTime = `${hours}:${mins} ${period}`;

    return formattedTime;
  };

  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);

  const [dayOfWeek, monthDay] = formattedDate.split(',');

  return (
    <div className='flex items-center rounded-2xl mb-4 w-full border-2 border-black  bg-neutral-500'>
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
      <Link
        className='mr-4 text-center min-w-[70px] bg-[hsl(var(--background))] text-[hsl(var(--text-color))] p-2 rounded-2xl'
        to={`/${path.toLowerCase()}/${event.id}`}
      >
        Info
      </Link>
    </div>
  );
};

export default Event;
