import { useLocation } from 'react-router-dom';
import { MapPin, CalendarDays, Tag, Ticket } from 'lucide-react';
import { formatDate, formatTime } from '../utils/utils';
import { EventCardData, EventCardSchema } from '../../../../schemas/schemas';


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

  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);

  return (
    <div className='flex flex-col h-full w-full max-w-7xl mx-4'>
      <div className='bg-black rounded-2xl flex items-center justify-between m-4 p-8'>
        <div className='text-[hsl(var(--text-color))]'>
          <h1 className='text-3xl'>{event.name}</h1>
          <div className='flex my-2'>
            <MapPin className='mr-2'/>
            <h2>
              {`${event._embedded.venues[0].city.name}, ${event._embedded.venues[0].state.stateCode ||
                event._embedded.venues[0].state.name}`}
            </h2>
          </div>
          <div className='flex my-2'>
            <CalendarDays className='mr-2'/>
            <h2>
              {formattedDate} - {formattedTime}
            </h2>
          </div>
          <div className='flex my-2'>
            <Tag className='mr-2'/>
              {event.priceRanges[0].min === event.priceRanges[0].max ? 
                <h2>${event.priceRanges[0].min}</h2> :
                <h2>${event.priceRanges[0].min} - ${event.priceRanges[0].max}</h2>
              }
          </div>
        </div>
        <div className='header-img'>
          <img src={event.images[0].url} alt={event.name}></img>
        </div>
      </div>
      <div className='flex flex-col items-center mx-4'>
        {event.description ? event.description : event.info}
        {event.url && (
          <a className='event-ticket-link' href={event?.url}>
            <Ticket className='-rotate-45'/>
            Get Tickets
          </a>
        )}
        {event.seatmap && (
          <div className='seatmap'>
            <h2>{event._embedded.venues[0].name}</h2>
            {/* {event._embedded.venues[0].address && <p>{event._embedded.venues[0].address}</p>} */}
            {event?.seatmap && (
              <img src={event.seatmap.staticUrl} alt={`${event._embedded.venues[0].name} Seatmap`}></img>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventInfo;
