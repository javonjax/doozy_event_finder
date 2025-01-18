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

const PinnedEventList = () => {
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
    <div className="h-full w-full max-w-7xl">
      <div className="m-4">
        <div className="flex w-full items-center justify-center rounded-2xl bg-[hsl(var(--background))] p-8 text-5xl text-[hsl(var(--text-color))]">
          <Pin size={42} className="mr-2 mt-2 -rotate-45 text-orange-400" /> My
          pinned events
        </div>
        <div className="flex h-full w-full flex-wrap justify-center gap-3 p-4 xl:justify-start">
          {!pinsContext?.pinnedEvents && (
            <div className="flex w-full justify-center rounded-2xl bg-[hsl(var(--background))] p-4 text-[hsl(var(--text-color))]">
              You have no pinned events. Click the{" "}
              <Pin className="mx-2 -rotate-45" /> on an event to add it to your
              pinned list.
            </div>
          )}
          {boxDates?.map((item) => {
            return (
              <div
                key={`${item[0]}, ${item[1]} pins box}`}
                className="m-4 flex h-[350px] w-[80%] flex-col items-center rounded-2xl bg-[hsl(var(--background))] p-4 text-[hsl(var(--text-color))] lg:w-[45%] xl:w-[30%]"
              >
                <div className="m-4 self-center text-3xl text-orange-400">
                  {item[0]} {item[1]}
                </div>
                <div className="flex w-full flex-col items-center overflow-y-auto">
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

export default PinnedEventList;
