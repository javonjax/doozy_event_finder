import { useQuery } from '@tanstack/react-query';
// import EventList from './EventList';
import { LocationContext } from '../Providers/LocationContext';
import { useState, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LocationContextHelper } from '@/schemas/schemas';
import { useLocation } from 'react-router-dom';
import { GenreData, GenreArraySchema } from '@/schemas/schemas';


const BACKEND_GENRES_API_URL: string = import.meta.env
  .VITE_BACKEND_GENRES_API_URL;

const CategoryContent = (): React.JSX.Element => {
  const { toast } = useToast();
  const [useLocationData, setUseLocationData] = useState<boolean>(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const context = useContext<LocationContextHelper | undefined>(
    LocationContext
  );
  const path: string = useLocation().pathname.slice(1);

  const handleGenreChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSelectedGenre(e.target.value);
  };

  const onCheckBox: React.ChangeEventHandler<HTMLInputElement> = async (): Promise<void> => {
    try {
      setUseLocationData((prev) => !prev);
      if (!context) {
        console.log('Location context is unavailable.');
        return;
      }
      const {location, requestLocation} = context;
      
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
    try {
      const res: globalThis.Response = await fetch(`${BACKEND_GENRES_API_URL}${path}`);
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
  };

  const { data: genres } = useQuery({
    queryKey: ['fetchGenres', path],
    queryFn: fetchGenres,
  });

  return (
    <>
      <div className='flex flex-col w-full items-center justify-center my-8 bg-[hsl(var(--background))] rounded-2xl p-4'>
        <div className='flex justify-evenly items-center w-full mb-4'>
          {genres?.length && (
            <div>
              <label htmlFor='subcategory-select' className='text-[hsl(var(--text-color))] mr-4'>Subcategory:</label>
              <select
                className='p-1'
                name='subcategory-select'
                value={selectedGenre}
                onChange={handleGenreChange}
              >
                <option value=''>Show all</option>
                {genres?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className='mr-2 text-[hsl(var(--text-color))]'>Start date:</label>
            <input type='date'></input>
          </div>
          <div>
            <label className='mr-2 text-[hsl(var(--text-color))]'>End date:</label>
            <input type='date'></input>
          </div>
        </div>
        {path.toLowerCase() !== 'local' && (
          <div>
            <input
              type='checkbox'
              id='location-checkbox'
              checked={useLocationData}
              onChange={onCheckBox}
            />
            <label htmlFor='location-checkbox' className='ml-2 text-[hsl(var(--text-color))]'>Search near your location</label>
          </div>
        )}
      </div>
      {/* <EventList
        route={path}
        selectedGenre={selectedGenre}
        location={
          useLocationData || path.toLowerCase() === 'local' ? location : null
        }
      ></EventList> */}
    </>
  );
};

export default CategoryContent;
