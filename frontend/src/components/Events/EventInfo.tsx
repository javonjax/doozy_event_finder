import { useLocation } from 'react-router-dom';
import { MapPin, CalendarDays, Tag, Ticket } from 'lucide-react';
import { formatDate, formatTime } from '../utils/utils';
import { EventCardData, EventCardSchema } from '../../../../schemas/schemas';
import { Link } from 'react-router-dom';


const EventInfo = (): React.JSX.Element => {
  const loc = useLocation();
  const data: unknown = loc.state;

  const parsedEvent = EventCardSchema.safeParse(data);
  if (!parsedEvent.success) {
    return <p>Invalid Data</p>;
  }
  const event: EventCardData = parsedEvent.data;
  const date: string = event.dates.start.localDate;
  const time: string = event.dates.start.localTime;

  console.log(event)

  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);

  return (
    <div className='flex flex-col h-full w-full max-w-7xl mx-4'>
      <div className='bg-[hsl(var(--background))] rounded-2xl m-4 p-8 text-[hsl(var(--text-color))]'>
        <div className='flex flex-col md:flex-row items-center justify-center md:justify-between'>
          <div className='flex flex-col items-center md:block'>
            <h1 className='text-3xl'>{event.name}</h1>
            <div className='flex my-2'>
              <MapPin className='mr-2' />
              <h2>
                {`${event._embedded.venues[0].city.name}, ${
                  event._embedded.venues[0].state.stateCode ||
                  event._embedded.venues[0].state.name
                }`}
              </h2>
            </div>
            <div className='flex my-2'>
              <CalendarDays className='mr-2' />
              <h2>
                {formattedDate} - {formattedTime}
              </h2>
            </div>
            <div className='flex my-2'>
              <Tag className='mr-2' />
              {event.priceRanges[0].min === event.priceRanges[0].max ? (
                <h2>${event.priceRanges[0].min}</h2>
              ) : (
                <h2>
                  ${event.priceRanges[0].min} - ${event.priceRanges[0].max}
                </h2>
              )}
            </div>
            <Link 
              className='text-[hsl(var(--text-color))] flex items-center w-fit border-2 border-orange-400 p-4 rounded-2xl'
              to={event.url}
              target='blank'>
              <Ticket size={18} className='-rotate-45 mr-1 text-orange-400' />
              Get Tickets
            </Link>
          </div>
          <div className='flex-shrink-0 min-w-305 min-h-203 my-4 md:my-0'>
            <img
              className='object-cover w-305 h-203'
              src={event.images[0].url}
              alt={event.name}
            ></img>
          </div>
        </div>
        <div className='my-4'>
          {event.description ? event.description : event.info}
        </div>
        <div className='flex flex-col items-center'>
            <h3>{event._embedded.venues[0].name}</h3>
            <h3>{event._embedded.venues[0].address.line1}</h3>
            <img
              src={event.seatmap.staticUrl}
              alt={`${event._embedded.venues[0].name} Seatmap`}
            ></img>
          </div>
      </div>
    </div>
  );
};

export default EventInfo;
