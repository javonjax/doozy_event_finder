import { NavLink } from 'react-router-dom';
import { EventCardData } from '../../../../schemas/schemas';

export interface EventLinkProps {
  path: string;
  event: EventCardData;
};

const EventLink = ({path, event}: EventLinkProps): React.JSX.Element => {
  return (
    <NavLink
      className='mr-4 text-center min-w-[70px] bg-[hsl(var(--background))] text-[hsl(var(--text-color))]  hover:text-orange-400 transform transition-all duration-400 hover:scale-110 p-2 rounded-2xl h-fit'
      to={`/${path.toLowerCase()}/${event.id}`}
      state={event}
    >
      Info
    </NavLink>
  );
};

export default EventLink;