import { useQuery } from '@tanstack/react-query';
import EventList from '../Events/EventList';
import { LocationContext } from '../Providers/LocationContext';
import { useState, useContext } from 'react';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';
import { Categories, LocationContextHelper } from '@/schemas/schemas';
import { useLocation } from 'react-router-dom';
import { GenreData, GenreArraySchema } from '@/schemas/schemas';
import CategoryFilters from './CategoryFilters';

const BACKEND_GENRES_API_URL: string = import.meta.env.VITE_BACKEND_GENRES_API_URL;

const CategoryContent = (): React.JSX.Element => {
  const { toast } = useToast();
  const [useLocationData, setUseLocationData] = useState<boolean>(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<GenreData | undefined>(undefined);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [queryDate, setQueryDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const context = useContext<LocationContextHelper | undefined>(
    LocationContext
  );

  const path: string = useLocation().pathname.slice(1);

  const handleSubcategoryChange = (subcategory?: GenreData): void => {
    if (subcategory) {
      setSelectedSubcategory(subcategory);
    } else {
      setSelectedSubcategory(undefined);
    }

  };

  const onCheckBox: React.ChangeEventHandler<HTMLInputElement> = async (): Promise<void> => {
    try {
      setUseLocationData((prev) => !prev);
      if (!context) {
        console.log('Location context is unavailable.');
        return;
      }
      const { location, requestLocation } = context;

      if (!location) {
        await requestLocation();
      }
    } catch (error) {
      toast({
        title: 'Location Services Required',
        description: 'Please enable location services to see local events.',
        variant: 'destructive',
        duration: 5000,
      });
      setUseLocationData(false);
    }
  };

  const fetchGenres = async (): Promise<Array<GenreData> | null> => {
    if (Categories.map((cat) => cat.toLowerCase()).includes(path)) {
      try {
        const res: globalThis.Response = await fetch(
          `${BACKEND_GENRES_API_URL}${path}`
        );
        if (!res.ok) {
          throw new Error('Error connecting to API.');
        }
        const data: unknown = await res.json();
        const parsedData = GenreArraySchema.safeParse(data);
        if (!parsedData.success) {
          throw new Error('Genre data is not in the correct format.');
        }
        if (!parsedData.data.length) {
          return [];
        }
        return parsedData.data;
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
            duration: 5000,
          });
        }
        return null;
      }
    } else {
      return null;
    }
  };

  const { data: genres } = useQuery({
    queryKey: ['fetchGenres', path],
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
          useLocationData || path.toLowerCase() === 'local'
            ? context?.location
            : undefined
        }
      />
    </>
  );
};

export default CategoryContent;
