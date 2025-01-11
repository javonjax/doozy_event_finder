import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@radix-ui/react-dropdown-menu';
import { Ticket, PinOff } from 'lucide-react';
import { PinnedEventData } from '../../../../schemas/schemas';
import { formatDate, formatTime } from '../utils/utils';
import { NavLink, useLocation } from 'react-router-dom';


export interface PinnedEventProps {
  event: PinnedEventData;
  handleUnpin: (event: PinnedEventData) => Promise<void>;
};

const PinnedEvent = ({ event, handleUnpin }: PinnedEventProps) => {
  
  return (
    <DropdownMenu key={event.id} modal={false}>
      <DropdownMenuTrigger className='text-[hsl(var(--text-color))] p-4 text-wrap hover:bg-white hover:text-black rounded-2xl'>
        {event.event_name}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        data-state={'closed'}
        className='z-10 text-[hsl(var(--text-color))] bg-black p-4 flex flex-col items-center w-fit max-w-[350px] border-[1px] border-white rounded-2xl'
      >
        <img src={event.img_url} />
        <div className='text-center my-2'>{event.event_name}</div>
        <div>
          {formatDate(event.event_date)}, {formatTime(event.event_time)}
        </div>
        <div className='flex m-2'>
          <NavLink
            className='flex justify-center items-center hover:text-black hover:bg-white p-3 rounded-2xl border-[1px] border-white min-w-[70px] m-2'
            to={`/${event.event_category.toLowerCase()}/${event.event_id}`}>
            Info
          </NavLink>
          <a
            href={event.ticket_url}
            target='_blank'
            className='flex justify-center items-center hover:text-black hover:bg-white p-3 rounded-2xl border-[1px] border-orange-400 m-2'>
            <Ticket className='-rotate-45 text-orange-400' />
          </a>
        </div>
        <button 
          className='flex justify-center items-center text-red-500 hover:bg-white p-3 rounded-2xl border-[1px] border-white min-w-[70px] m-2'
          onClick={() => handleUnpin(event)}>
          <PinOff />
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PinnedEvent;
