import { useQuery } from "@tanstack/react-query";
import EventList from "../Events/EventList";
import {
  LocationContext,
  LocationContextProvider,
} from "../Providers/LocationContext";
import { useState, useContext, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";
import { Categories } from "@/schemas/schemas";
import { useLocation } from "react-router-dom";
import { GenreData, GenreArraySchema } from "@/schemas/schemas";
import CategoryFilters from "./CategoryFilters";

// Environment variables.
const BACKEND_GENRES_API_URL: string = import.meta.env
  .VITE_BACKEND_GENRES_API_URL;

// Parent component for CategoryFilters and EventList.
const CategoryContent = (): React.JSX.Element => {
  // Hooks.
  const { toast } = useToast();
  const [useLocationData, setUseLocationData] = useState<boolean>(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    GenreData | undefined
  >(undefined);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [queryDate, setQueryDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const locationContext = useContext<LocationContextProvider | undefined>(
    LocationContext,
  );
  const loc = useLocation();
  const path: string = loc.pathname.slice(1);

  useEffect(() => {
    // For navigating to this page using a subcategory tags in the EventInfo component.
    // Allows users to quickly find events from the same subcategory as the event they were looking at.
    if (loc.state) {
      setSelectedSubcategory(loc.state);
    }
  }, [loc.state]);

  // Event handlers
  const handleSubcategoryChange = (subcategory?: GenreData): void => {
    if (subcategory) {
      setSelectedSubcategory(subcategory);
    } else {
      setSelectedSubcategory(undefined);
    }
  };

  const onCheckBox: React.ChangeEventHandler<
    HTMLInputElement
  > = async (): Promise<void> => {
    try {
      setUseLocationData((prev) => !prev);
      if (!locationContext) {
        console.error("Location context is unavailable.");
        return;
      }
      const { location, requestLocation } = locationContext;

      if (!location) {
        await requestLocation();
      }
    } catch {
      toast({
        title: "Location Services Required",
        description: "Please enable location services to see local events.",
        variant: "destructive",
        duration: 5000,
      });
      setUseLocationData(false);
    }
  };

  const fetchGenres = async (): Promise<Array<GenreData> | null> => {
    if (Categories.some((cat) => cat.toLowerCase() === path)) {
      try {
        const res: globalThis.Response = await fetch(
          `${BACKEND_GENRES_API_URL}${path}`,
        );

        const jsonRes: unknown = await res.json();
        if (!res.ok) {
          if (jsonRes && typeof jsonRes === "object" && "message" in jsonRes) {
            if (
              typeof jsonRes.message === "string" &&
              jsonRes.message.includes("429")
            ) {
              return null;
            }
          } else {
            throw new Error("Error connecting to API.");
          }
        }
        const parsedData = GenreArraySchema.safeParse(jsonRes);
        if (!parsedData.success) {
          throw new Error("Genre data is not in the correct format.");
        }
        if (!parsedData.data.length) {
          return [];
        }
        return parsedData.data;
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
            duration: 5000,
          });
        }
        return null;
      }
    } else {
      return null;
    }
  };

  // Query handler.
  const { data: genres } = useQuery({
    queryKey: ["fetchGenres", path],
    queryFn: fetchGenres,
  });
  return (
    <>
      <CategoryFilters
        path={path}
        genres={genres}
        handleSubcategoryChange={handleSubcategoryChange}
        onCheckBox={onCheckBox}
        selectedSubcategory={selectedSubcategory}
        useLocationData={useLocationData}
        date={date}
        setDate={setDate}
        setQueryDate={setQueryDate}
      />
      <EventList
        selectedSubcategory={selectedSubcategory}
        dateRange={queryDate}
        location={
          useLocationData || path.toLowerCase() === "local"
            ? locationContext?.location
            : undefined
        }
      />
    </>
  );
};

export default CategoryContent;
