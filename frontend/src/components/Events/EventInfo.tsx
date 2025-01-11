import { useLocation } from 'react-router-dom';
import { MapPin, CalendarDays, Tag, Ticket } from 'lucide-react';
import { formatDate, formatTime } from '../utils/utils';
import { EventCardData, EventCardSchema } from '../../../../schemas/schemas';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Environment variables.
const BACKEND_EVENTS_API_URL: string = import.meta.env
  .VITE_BACKEND_EVENTS_API_URL;

const EventInfo = (): React.JSX.Element => {
  const loc = useLocation();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventCardData>();
  const [formattedDate, setFormattedDate] = useState<string>();
  const [formattedTime, setFormattedTime] = useState<string>();
  
  useEffect(() => {
    const fetchEvent = async (): Promise<void> => {
      try {
        const eventId = loc.pathname.split('/')[2];
        const res: globalThis.Response = await fetch(
          `${BACKEND_EVENTS_API_URL}${eventId}`, 
          {
            method: 'GET',
            credentials: 'include'
          }
        );
        const data: unknown = await res.json();

        if (!res.ok) {
          throw new Error('Error fetching this event.');
        }
        const parsedEvent = EventCardSchema.safeParse(data);
        if (!parsedEvent.success) {
          throw new Error('Response data does not fit the desired schema.');
        }
        const event: EventCardData = parsedEvent.data;
        const time = event.dates.start.localTime;
        const date = event.dates.start.localDate;
        setEvent(event);
        setFormattedTime(formatTime(time));
        setFormattedDate(formatDate(date));
      } catch (error) {
        if (error instanceof Error) {
          setEvent(undefined);
          console.error(error);
          toast({
            title: `Uh oh.`,
            description: error.message,
            variant: 'destructive',
            duration: 5000,
          });
        }
      }
    };

    const parseEventState = () => {
      const parsedEvent = EventCardSchema.safeParse(data);
      if (!parsedEvent.success) {
        console.log('parse failed')
        setEvent(undefined);
        return;
      }
      const event: EventCardData = parsedEvent.data;
      const time = event.dates.start.localTime;
      const date = event.dates.start.localDate;
      console.log(event, 'parsed event')
      setEvent(event);
      setFormattedTime(formatTime(time));
      setFormattedDate(formatDate(date));
    };

    const data: unknown = loc.state;
    console.log(data)
    if (!data) {
      console.log('fetching event')
      fetchEvent();
    } else {
      console.log('parsing event state')
      parseEventState();
    }

    console.log(event)
  }, []);

  if (!event) {
    return (
      <div className='bg-[hsl(var(--background))] rounded-2xl m-4 p-8 text-[hsl(var(--text-color))] my-auto mx-auto'>
        Event not found.
      </div>
    );
  }
  
  return (
    // {!event &&
    //   <div className='bg-[hsl(var(--background))] rounded-2xl m-4 p-8 text-[hsl(var(--text-color))] my-auto mx-auto'>
    //     Event not found.
    //   </div>
    // }

    // {event &&
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
              className='text-[hsl(var(--text-color))] flex items-center w-fit border-[1px] border-orange-400 p-4 rounded-2xl hover:text-black hover:bg-white'
              to={event.url || '/'}
              target='blank'
            >
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
