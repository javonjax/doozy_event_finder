import { NavLink } from 'react-router-dom';
import { EventCardData } from '../../../../schemas/schemas';

const EventLink = ({path, event}: { path: string, event: EventCardData }): React.JSX.Element => {
  return (
    <NavLink
      className='mr-4 text-center min-w-[70px] bg-[hsl(var(--background))] text-[hsl(var(--text-color))] p-2 rounded-2xl h-fit'
      to={`/${path.toLowerCase()}/${event.id}`}
      state={event}
    >
      Info
    </NavLink>
  );
};

export default EventLink;