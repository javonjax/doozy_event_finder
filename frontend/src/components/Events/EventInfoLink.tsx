import { NavLink } from "react-router-dom";
import { EventCardData } from "../../../../schemas/schemas";

export interface EventLinkProps {
  path: string;
  event: EventCardData;
}

// Passes event information from the Event component card to the EventInfo page through NavLink state.
const EventInfoLink = ({ path, event }: EventLinkProps): React.JSX.Element => {
  return (
    <NavLink
      className="mr-4 h-fit min-w-[70px] rounded-2xl bg-[hsl(var(--background))] p-2 text-center text-[hsl(var(--text-color))] hover:bg-[hsl(var(--text-color))] hover:text-[hsl(var(--background))]"
      to={`/${path.toLowerCase()}/${event.id}`}
      state={event}
    >
      Info
    </NavLink>
  );
};

export default EventInfoLink;
