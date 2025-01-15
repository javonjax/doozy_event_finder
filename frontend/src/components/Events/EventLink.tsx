import { NavLink } from "react-router-dom";
import { EventCardData } from "../../../../schemas/schemas";

export interface EventLinkProps {
  path: string;
  event: EventCardData;
}

// Passes event information from the Event component card to the EventInfo page through NavLink state.
const EventLink = ({ path, event }: EventLinkProps): React.JSX.Element => {
  return (
    <NavLink
      className="mr-4 text-center min-w-[70px] bg-[hsl(var(--background))] text-[hsl(var(--text-color))] hover:text-[hsl(var(--background))] hover:bg-[hsl(var(--text-color))] p-2 rounded-2xl h-fit "
      to={`/${path.toLowerCase()}/${event.id}`}
      state={event}
    >
      Info
    </NavLink>
  );
};

export default EventLink;
