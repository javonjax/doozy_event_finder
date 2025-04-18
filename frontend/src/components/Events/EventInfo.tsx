import { NavLink, useLocation } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  Ticket,
  PinOff,
  Pin,
  Loader,
  Tags,
} from "lucide-react";
import { formatDate, formatTime } from "../utils/utils";
import { EventCardData, EventCardSchema } from "../../../../schemas/schemas";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthContextProvider, AuthContext } from "../Providers/AuthContext";
import { PinsContextProvider, PinsContext } from "../Providers/PinsContext";

// Environment variables.
const BACKEND_EVENTS_API_URL: string = import.meta.env
  .VITE_BACKEND_EVENTS_API_URL;
const BACKEND_PINS_API_URL: string = import.meta.env.VITE_BACKEND_PINS_API_URL;

const EventInfo = (): React.JSX.Element => {
  const [event, setEvent] = useState<EventCardData>();
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [formattedDate, setFormattedDate] = useState<string>();
  const [formattedTime, setFormattedTime] = useState<string>();
  const authContext = useContext<AuthContextProvider | undefined>(AuthContext);
  const pinsContext = useContext<PinsContextProvider | undefined>(PinsContext);
  const loc = useLocation();
  const path: string = loc.pathname.split("/")[1];
  const { toast } = useToast();

  // Events are passed through NavLink state if possible. Otherwise they are fetched from the API directly.
  useEffect(() => {
    const fetchEvent = async (): Promise<void> => {
      try {
        const eventId = loc.pathname.split("/")[2];
        const res: globalThis.Response = await fetch(
          `${BACKEND_EVENTS_API_URL}${eventId}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data: unknown = await res.json();

        if (!res.ok) {
          throw new Error("Error fetching this event.");
        }
        const parsedEvent = EventCardSchema.safeParse(data);
        if (!parsedEvent.success) {
          throw new Error("Response data does not fit the desired schema.");
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
          toast({
            title: "Uh oh.",
            description: error.message,
            variant: "destructive",
            duration: 5000,
          });
        }
      }
    };

    const parseEventState = () => {
      const parsedEvent = EventCardSchema.safeParse(data);
      if (!parsedEvent.success) {
        setEvent(undefined);
        return;
      }
      const event: EventCardData = parsedEvent.data;
      const time = event.dates.start.localTime;
      const date = event.dates.start.localDate;
      setEvent(event);
      setFormattedTime(formatTime(time));
      setFormattedDate(formatDate(date));
    };

    const data: unknown = loc.state;
    if (!data) {
      fetchEvent();
    } else {
      parseEventState();
    }
  }, []);

  // Update the pin icon when the pinsContext updates.
  useEffect(() => {
    if (event) {
      checkIfPinned(event.id);
    } else {
      setIsPinned(false);
    }
  }, [event, pinsContext]);

  const checkIfPinned = (eventId: string): void => {
    if (
      !pinsContext ||
      !pinsContext.pinnedEvents ||
      pinsContext.pinnedEvents?.length === 0
    ) {
      return setIsPinned(false);
    }
    return setIsPinned(
      pinsContext.pinnedEvents.some((event) => event.event_id === eventId),
    );
  };

  const handlePin = async (event: EventCardData): Promise<void> => {
    try {
      if (!authContext?.loggedIn) {
        toast({
          title: "Join us!",
          description: (
            <span>
              You need to{" "}
              <NavLink to="/login" className="underline">
                login
              </NavLink>{" "}
              or{" "}
              <NavLink to="/register" className="underline">
                register
              </NavLink>{" "}
              an account to pin events.
            </span>
          ),
          className: "bg-orange-500",
          duration: 5000,
        });
        return;
      }

      const res: globalThis.Response = await fetch(BACKEND_PINS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...event,
          category: path,
        }),
      });

      const jsonRes: { message: string } = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          authContext.logout();
          toast({
            title: "Join us!",
            description: (
              <span>
                You need to{" "}
                <NavLink to="/login" className="underline">
                  login
                </NavLink>{" "}
                or{" "}
                <NavLink to="/register" className="underline">
                  register
                </NavLink>{" "}
                an account to pin events.
              </span>
            ),
            className: "bg-orange-500",
            duration: 5000,
          });
          return;
        }
        throw new Error(jsonRes.message);
      }

      await pinsContext?.fetchPinnedEvents();
      toast({
        title: "Event pinned!",
        description: (
          <span>
            Check out your pins on the{" "}
            <NavLink to="/pins" className="underline">
              pinned events
            </NavLink>{" "}
            page.
          </span>
        ),
        className: "text-[hsl(var(--text-color))] bg-green-600",
        duration: 5000,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Uh oh.",
          description: error.message,
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  };

  const handleUnpin = async (event: EventCardData): Promise<void> => {
    try {
      if (!authContext?.loggedIn) {
        toast({
          title: "Join us!",
          description: (
            <span>
              You need to{" "}
              <NavLink to="/login" className="underline">
                login
              </NavLink>{" "}
              or{" "}
              <NavLink to="/register" className="underline">
                register
              </NavLink>{" "}
              an account to pin events.
            </span>
          ),
          className: "bg-orange-500",
          duration: 5000,
        });
        return;
      }

      const res: globalThis.Response = await fetch(
        `${BACKEND_PINS_API_URL}${event.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const jsonRes: { message: string } = await res.json();

      if (!res.ok) {
        throw new Error(jsonRes.message);
      }

      await pinsContext?.fetchPinnedEvents();

      toast({
        title: "Event un-pinned!",
        description: `${event.name} has been removed from your pinned events.`,
        className: "text-[hsl(var(--text-color))] bg-green-600",
        duration: 5000,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Uh oh.",
          description: error.message,
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  };

  return (
    <div className="mx-4 flex h-full w-full max-w-7xl flex-col items-center justify-center">
      {!event && (
        <div className="flex w-full justify-center">
          <div className="mb-4 flex w-fit justify-center rounded-2xl bg-[hsl(var(--background))] p-4 text-[hsl(var(--text-color))]">
            <Loader className="animate-spin" />
            <p id="initial-fetch-loading" className="ml-1 text-center">
              Finding event info...
            </p>
          </div>
        </div>
      )}
      {event && (
        <div className="m-4 grow rounded-2xl bg-[hsl(var(--background))] p-8 text-[hsl(var(--text-color))]">
          <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
            <div className="flex flex-col items-center md:block">
              <h1 className="text-3xl">{event.name}</h1>
              <div className="my-2 flex">
                <MapPin className="mr-2" />
                <h2>
                  {`${event._embedded.venues[0].city.name}, ${
                    event._embedded.venues[0].state.stateCode ||
                    event._embedded.venues[0].state.name
                  }`}
                </h2>
              </div>
              <div className="my-2 flex items-center">
                <CalendarDays className="mr-2" />
                <h2>
                  {formattedDate} - {formattedTime}
                </h2>
              </div>
              <div className="my-2 flex items-center">
                <Tags className="mr-2" />
                <div className="flex gap-x-2">
                  <NavLink
                    className="text-orange-400 underline"
                    to={`/${path}`}
                  >
                    {path[0].toUpperCase() + path.slice(1)}
                  </NavLink>
                  <NavLink
                    className="text-orange-400 underline"
                    to={`/${path}`}
                    state={event.classifications[0].genre}
                  >
                    {event.classifications[0].genre.name.toLowerCase() !==
                    "undefined"
                      ? event.classifications[0].genre.name
                      : null}
                  </NavLink>
                </div>
              </div>
              {/* NOTE: Ticketmaster seems to have removed price ranges from their API.
                        The API documentation does not show that they have removed this data so
                        it is unclear if this change is permanent.  
              */}
              {/* <div className="my-2 flex">
                <Tag className="mr-2" />
                {event.priceRanges[0].min === event.priceRanges[0].max ? (
                  <h2>${event.priceRanges[0].min}</h2>
                ) : (
                  <h2>
                    ${event.priceRanges[0].min} - ${event.priceRanges[0].max}
                  </h2>
                )}
              </div> */}
              <div className="flex items-center">
                <Link
                  className="flex h-[55px] w-fit items-center rounded-2xl border-[1px] border-orange-400 p-4 text-[hsl(var(--text-color))] hover:bg-white hover:text-black"
                  to={event.url || "/"}
                  target="blank"
                >
                  <Ticket
                    size={18}
                    className="mr-1 -rotate-45 text-orange-400"
                  />
                  Get Tickets
                </Link>
                <button
                  className={`m-2 flex h-[55px] w-[55px] items-center justify-center rounded-2xl border-[1px] border-white p-3 hover:bg-white ${
                    isPinned
                      ? "text-red-500"
                      : "text-[hsl(var(--text-color))] hover:text-[hsl(var(--background))]"
                  }`}
                  onClick={() => {
                    isPinned ? handleUnpin(event) : handlePin(event);
                  }}
                >
                  {isPinned ? <PinOff /> : <Pin className="-rotate-45" />}
                </button>
              </div>
            </div>
            <div className="min-w-305 min-h-203 my-4 flex-shrink-0 md:my-0">
              <img
                className="w-305 h-203 object-cover"
                src={event.images[0].url}
                alt={event.name}
              ></img>
            </div>
          </div>
          <div className="my-4">
            {event.description ? event.description : event.info}
          </div>
          <div className="flex flex-col items-center">
            <h3>{event._embedded.venues[0].name}</h3>
            <h3>{event._embedded.venues[0].address.line1}</h3>
            <img
              src={event.seatmap.staticUrl}
              alt={`${event._embedded.venues[0].name} Seatmap`}
            ></img>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventInfo;
