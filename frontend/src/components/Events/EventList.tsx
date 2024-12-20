import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { Categories, Coordinates, GenreData } from '@/schemas/schemas';
import { EventsAPIResSchema, EventsAPIRes, EventCardData } from '../../../../schemas/schemas';
import Event from './Event';
import { Loader } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';

export interface EventListProps {
  selectedSubcategory?: GenreData | undefined;
  location?: Coordinates;
  dateRange?: DateRange | undefined;
};

const EventList = ({ selectedSubcategory, location, dateRange }: EventListProps) => {
  // List of event objects visible on the page.
  const [visibleEvents, setVisibleEvents] = useState<Array<EventCardData>>(); 
  // Number of visible events.
  const [numVisible, setNumVisible] = useState<number>(0);  
  // Tracks if there are more events available to display from the current data.
  const [hasMore, setHasMore] = useState<boolean>(false);
  // The Ticketmaster API only supports retrieving up to the 1000th item (max 200 items per page, the 5th page is the last).
  const MAX_PAGES: number = 4; 

  const BACKEND_EVENTS_API_URL = import.meta.env.VITE_BACKEND_EVENTS_API_URL;
  const path: string = useLocation().pathname.slice(1);

  const fetchEvents = async (pageParam: number): Promise<EventsAPIRes> => {
    // Construct query params.
    let startDate = undefined;
    let endOfStartDate = undefined;
    let endDate = undefined;
    let queryParams: string = `sort=date,name,asc`;
    if (dateRange) {
      if (dateRange.from) {
        startDate = dateRange.from;
        startDate.setHours(0, 0, 0, 0);
        endOfStartDate = addDays(startDate, 1);
        startDate = startDate.toJSON().slice(0, -5) + 'Z';
        endOfStartDate = endOfStartDate.toJSON().slice(0, -5) + 'Z';
        console.log(startDate, 'startdate')
      }
      if (dateRange.to) {
        endDate = dateRange.to;
        endDate.setHours(0, 0, 0, 0);
        endDate = addDays(endDate, 1);
        endDate = endDate.toJSON().slice(0, -5) + 'Z';
        console.log(endDate, 'end date')
      }
    }

    if (!startDate) {
      const today: string = new Date().toJSON().slice(0, -5) + 'Z';
      console.log(today, 'today')
      queryParams += `&startDateTime=${today}`;
    } else {
      if (endDate) {
        queryParams += `&startEndDateTime=${startDate},${endDate}`;
      } else {
        
        queryParams += `&startEndDateTime=${startDate},${endOfStartDate}`;
      }
    }
    
    if (Categories.map((cat) => cat.toLowerCase()).includes(path)) {
      if (path === 'misc') {
        // The Ticketmaster API requires the full word.
        queryParams += `&classificationName=miscellaneous`;
      } else {
        queryParams += `&classificationName=${path}`;
      }
    }

    if (selectedSubcategory) {
      queryParams += `&genreId=${selectedSubcategory.id}`;
    }
    
    if (location) {
      queryParams += `&latlong=${location.latitude},${location.longitude}&radius=50`;
    }

    if (pageParam <= MAX_PAGES) {
      queryParams += `&page=${pageParam}`;
    }
    console.log(queryParams)
    // Fetch data from backend API.
    const res: globalThis.Response = await fetch(`${BACKEND_EVENTS_API_URL}?${queryParams}`);

    if (!res.ok) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }

    const eventData: unknown = await res.json();
    const parsedEventData = EventsAPIResSchema.safeParse(eventData);

    if (!parsedEventData.success) {
      throw new Error(`API response format was incorrect.`);
    }

    const events = parsedEventData.data.events;
    const nextPage = parsedEventData.data.nextPage;
    
    console.log('fetched', events)
    console.log('more', nextPage)
    
    // When the initial data is fetched, set the appropriate amount of visible events.
    if (pageParam === 0) {
      if (events.length <= 10) {
        setNumVisible(events.length);
      } else {
        setNumVisible(10);
      }
    }

    // Set hasMore based on how many events are fetched
    if (events.length <= 10) {
      setHasMore(false);
      if (events.length === 0) {
        throw new Error('No events found.');
      }
    } else {
      setHasMore(true);
    }
    console.log('length', events.length);
    return parsedEventData.data;
  };

  // Tanstack query to fetch data.
  const { 
      data, 
      error, 
      isLoading, 
      isFetching, 
      hasNextPage, 
      fetchNextPage, 
      isFetchingNextPage,
      isFetchNextPageError 
    } = useInfiniteQuery({
    queryKey: ['fetchEvents', path, selectedSubcategory, location, dateRange],
    queryFn: ({ pageParam }) => fetchEvents(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage: EventsAPIRes) => lastPage.nextPage,
    refetchOnWindowFocus: false,
    retry: 1
  });

  // OnClick handler for the button that loads more events.
  const handleGetNextPage = async () => {
    if (!isFetching && data) {  
      const numAvailable: number = data.pages.flatMap((page) => page.events).length;
      console.log('initial num available', numAvailable);
      if (numAvailable > numVisible + 10) {
        // If there are more than enough events, display them.
        setNumVisible(prev => prev + 10);
      } else if (numAvailable === numVisible + 10) {
        // If we have exactly enough, display them and fetch more.
        setNumVisible(prev => prev + 10);
        if (!isFetchingNextPage) {
          fetchNextPage();
        }
      } else {
        // If we have less than enough, check if there is a next page, and await the results
        // before updating the list.
        if (hasNextPage) {
          if (!isFetchingNextPage) {
            await fetchNextPage();
            setNumVisible(prev => prev + 10); 
          }
        } else{
          // If there are no more pages, display the remaining available events and set hasMore to false.
          setNumVisible(numAvailable);
          setHasMore(false);
        }
      }
    }
  };

  // Set the visible events.
  useEffect(() => {
    if (data) {
      console.log(numVisible, 'visible')
      console.log(data.pages.flatMap((page) => page.events))
      const dataMap = data.pages.flatMap((page) => page.events);
      setVisibleEvents([...dataMap.slice(0, numVisible)]);
    }
  }, [data, numVisible]);

  // Fail safe to hide the button that shows more events when fetching the next page fails.
  useEffect(() => setHasMore(false), [isFetchNextPageError]);

  if (isLoading) {
    return (
    <div className='w-full flex justify-center'>
      <div className='flex justify-center bg-[hsl(var(--background))] text-[hsl(var(--text-color))] w-fit p-4 rounded-2xl mb-4'>
        <Loader className='animate-spin'/>
        <p id='initial-fetch-loading' className='ml-1 text-center'>Finding events...</p>
      </div>
    </div>
  );
  }

  if (error && !isFetchNextPageError) {
    return (
      <div className='w-full flex justify-center'>
        <div className='flex justify-center bg-[hsl(var(--background))] text-[hsl(var(--text-color))] w-fit p-4 rounded-2xl mb-4'>
          <p id='initial-fetch-loading' className='ml-1 text-center'>
            No Events found.
          </p>
        </div>
      </div>
    );
  }

  // Render an event component for each event returned from the backend API.
  return (
    <>
      <div className='flex flex-col items-center w-full'>
        {visibleEvents?.map((event) => (
          <Event key={event.id} event={event} path={path}></Event>
        ))}
        {isFetching &&
          <div className='flex justify-center bg-[hsl(var(--background))] text-[hsl(var(--text-color))] w-fit p-4 rounded-2xl'>
          <Loader className='text-[hsl(var(--text-color))] animate-spin'/>
          <p className='ml-1 text-center'>Loading events... </p>
        </div>
        }
        <button 
          className={
            !data || !hasMore || data.pages.flatMap((page) => page.events).length <= 10 
            ? 'hidden' : 
              'cursor-pointer m-4 p-4 rounded-2xl text-center bg-[hsl(var(--background))] text-[hsl(var(--text-color))]'
          }
          onClick={handleGetNextPage} 
        >See more</button>
      </div>
    </>
  );
};

export default EventList;
