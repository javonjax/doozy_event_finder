import { useContext, useEffect, useState } from "react";
import { PinsContext, PinsContextProvider } from "../Providers/PinsContext";
import { Pin } from "lucide-react";
import PinnedEvent from "./PinnedEvent";
import { useToast } from "@/hooks/use-toast";
import { AuthContext, AuthContextProvider } from "../Providers/AuthContext";
import { PinnedEventData } from "../../../../schemas/schemas";
import { NavLink } from "react-router-dom";

// Environment variables.
const BACKEND_PINS_API_URL: string = import.meta.env.VITE_BACKEND_PINS_API_URL;

const PinnedEvents = () => {
  // Hooks.
  const pinsContext: PinsContextProvider | undefined = useContext<
    PinsContextProvider | undefined
  >(PinsContext);
  const authContext = useContext<AuthContextProvider | undefined>(AuthContext);
  const [boxDates, setBoxDates] = useState<Array<[string, string, string]>>();
  const { toast } = useToast();

  useEffect(() => {
    const getPinnedEvents = async () => {
      if (
        !pinsContext?.pinnedEvents ||
        pinsContext.pinnedEvents?.length === 0
      ) {
        await pinsContext?.fetchPinnedEvents();
      }
    };

    // Finds unique months and year combinations among the pinned events so events can be grouped together.
    const getMonthsAndYears = pinsContext?.pinnedEvents?.reduce<
      Array<[string, string, string]>
    >((acc, event) => {
      const [yearNum, monthNum]: Array<string> = event.event_date.split("-");
      const monthNames: Array<string> = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthStr: string = monthNames[Number(monthNum) - 1];
      if (!acc.some((item) => item[0] === monthStr && item[1] === yearNum)) {
        acc.push([monthStr, yearNum, monthNum]);
      }
      return acc;
    }, []);

    getPinnedEvents();
    setBoxDates(getMonthsAndYears);
  }, [pinsContext]);

  // Event handlers.
  const handleUnpin = async (event: PinnedEventData): Promise<void> => {
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
        `${BACKEND_PINS_API_URL}${event.event_id}`,
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
        description: `${event.event_name} has been removed from your pinned events.`,
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
    <div className="max-w-7xl w-full h-full">
      <div className="m-4">
        <div className="flex items-center justify-center w-full p-8 bg-[hsl(var(--background))] text-[hsl(var(--text-color))] rounded-2xl text-5xl">
          <Pin size={42} className="-rotate-45 mr-2 text-orange-400 mt-2" /> My
          pinned events
        </div>
        <div className="flex flex-wrap p-4 w-full h-full xl:justify-start justify-center gap-3">
          {!pinsContext?.pinnedEvents && (
            <div className="flex justify-center bg-[hsl(var(--background))] text-[hsl(var(--text-color))] p-4 rounded-2xl w-full">
              You have no pinned events. Click the{" "}
              <Pin className="-rotate-45 mx-2" /> on an event to add it to your
              pinned list.
            </div>
          )}
          {boxDates?.map((item) => {
            return (
              <div
                key={`${item[0]}, ${item[1]} pins box}`}
                className="bg-[hsl(var(--background))] text-[hsl(var(--text-color))] p-4 rounded-2xl flex flex-col items-center m-4 w-[80%] lg:w-[45%] xl:w-[30%] h-[350px]"
              >
                <div className="text-3xl m-4 self-center text-orange-400">
                  {item[0]} {item[1]}
                </div>
                <div className="flex flex-col items-center w-full overflow-y-auto">
                  {pinsContext?.pinnedEvents?.map((event) => {
                    const [yearNum, monthNum]: Array<string> =
                      event.event_date.split("-");
                    if (item[1] === yearNum && item[2] === monthNum) {
                      return (
                        <PinnedEvent
                          key={event.event_id}
                          event={event}
                          handleUnpin={handleUnpin}
                        />
                      );
                    } else {
                      return;
                    }
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PinnedEvents;
