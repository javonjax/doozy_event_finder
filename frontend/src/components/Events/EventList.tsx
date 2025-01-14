import { useState, useEffect, useContext } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { NavLink, useLocation } from 'react-router-dom';
import { Categories, Coordinates, GenreData } from '@/schemas/schemas';
import { EventsAPIResSchema, EventsAPIRes, EventCardData } from '../../../../schemas/schemas';
import Event from './Event';
import { Loader } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { AuthContext, AuthContextProvider } from '../Providers/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PinsContextProvider, PinsContext } from '../Providers/PinsContext';


export interface EventListProps {
  selectedSubcategory?: GenreData | undefined;
  location?: Coordinates;
  dateRange?: DateRange | undefined;
};

// Environment variables.
const BACKEND_EVENTS_API_URL: string = import.meta.env.VITE_BACKEND_EVENTS_API_URL;
const BACKEND_PINS_API_URL: string = import.meta.env.VITE_BACKEND_PINS_API_URL;
// The Ticketmaster API only supports retrieving up to the 1000th item (max 200 items per page, the 5th page is the last).
const MAX_PAGES: number = 4; 

const EventList = ({ selectedSubcategory, location, dateRange }: EventListProps) => {
  // Hooks
  const [visibleEvents, setVisibleEvents] = useState<Array<EventCardData>>(); // List of event objects visible on the page.
  const [numVisible, setNumVisible] = useState<number>(0);  // Number of visible events.
  const [hasMore, setHasMore] = useState<boolean>(false); // Tracks if there are more events available to display from the current data.
  const path: string = useLocation().pathname.slice(1);
  const authContext = useContext<AuthContextProvider | undefined>(AuthContext);
  const pinsContext = useContext<PinsContextProvider | undefined>(PinsContext);
  const { toast } = useToast();

  // Query function.
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
      }
      if (dateRange.to) {
        endDate = dateRange.to;
        endDate.setHours(0, 0, 0, 0);
        endDate = addDays(endDate, 1);
        endDate = endDate.toJSON().slice(0, -5) + 'Z';
      }
    }

    if (!startDate) {
      const today: string = new Date().toJSON().slice(0, -5) + 'Z';
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
    
    // Fetch data from backend API.
    const res: globalThis.Response = await fetch(`${BACKEND_EVENTS_API_URL}?${queryParams}`,
      { credentials: 'include'}
    );

    if (!res.ok) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }

    const eventData: unknown = await res.json();
    const parsedEventData = EventsAPIResSchema.safeParse(eventData);

    if (!parsedEventData.success) {
      throw new Error(`API response format was incorrect.`);
    }

    const events: Array<EventCardData> = parsedEventData.data.events;
    const nextPage: number | null = parsedEventData.data.nextPage;
    
    // When the initial data is fetched, set the appropriate amount of visible events.
    if (pageParam === 0) {
      if (events.length <= 10) {
        setNumVisible(events.length);
      } else {
        setNumVisible(10);
      }
    }

    // Set hasMore based on how many events are fetched
    if (typeof nextPage === 'number') {
      setHasMore(true);
    } else {
      if (events.length >= 10) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    }
    return parsedEventData.data;
  };

  // Query handler.
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

  // Event handlers.
  const handleGetNextPage = async (): Promise<void> => {
    if (!isFetching && data) {  
      const numAvailable: number = data.pages.flatMap((page) => page.events).length;
      if (numAvailable > numVisible + 10) {
        // If there are more than enough events, display them.
        setNumVisible(prev => prev + 10);
      } else if (numAvailable === numVisible + 10) {
        // If there are exactly enough, display them and fetch more.
        setNumVisible(prev => prev + 10);
        if (!isFetchingNextPage) {
          fetchNextPage();
        }
      } else {
        // If there are less than enough, check if there is a next page, and await the results before updating the list.
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

  const handlePin = async (event: EventCardData): Promise<void> => {
    try {  
      if (!authContext?.loggedIn) {
        toast({
          title: 'Join us!',
          description: (
            <span>
              You need to{' '}
              <NavLink
                  to='/login'
                  className='underline'>
                  login
                </NavLink>
                {' '}or{' '}
                <NavLink
                  to='/register'
                  className='underline'>
                  register
                </NavLink>
                {' '}an account to pin events.
            </span>
          ),
          className: 'bg-orange-500',
          duration: 5000,
        });
        return;
      }   

      const res: globalThis.Response = await fetch(BACKEND_PINS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...event,
          category: path
        })
      });
      
      const jsonRes: { message: string } = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          authContext.logout();
          toast({
            title: 'Join us!',
            description: (
              <span>
                You need to{' '}
                <NavLink
                  to='/login'
                  className='underline'>
                  login
                </NavLink>
                {' '}or{' '}
                <NavLink
                  to='/register'
                  className='underline'>
                  register
                </NavLink>
                {' '}an account to pin events.
              </span>
            ),
            className: 'bg-orange-500',
            duration: 5000,
          });
          return;
        }
        throw new Error(jsonRes.message);
      } 

      await pinsContext?.fetchPinnedEvents();
      toast({
        title: 'Event pinned!',
        description: (
          <span>
            Check out your pins on the{' '}
            <NavLink
              to='/pins'
              className='underline'>
              pinned events
            </NavLink>
            {' '}page.
          </span>
        ),
        className: 'text-[hsl(var(--text-color))] bg-green-600',
        duration: 5000,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: `Uh oh.`,
          description: error.message,
          variant: 'destructive',
          duration: 5000,
        });
      }
    }
  };

  const handleUnpin = async (event: EventCardData): Promise<void> => {
    try {
      if (!authContext?.loggedIn) {
        toast({
          title: 'Join us!',
          description: (
            <span>
              You need to{' '}
              <NavLink
                  to='/login'
                  className='underline'>
                  login
                </NavLink>
                {' '}or{' '}
                <NavLink
                  to='/register'
                  className='underline'>
                  register
                </NavLink>
                {' '}an account to pin events.
            </span>
          ),
          className: 'bg-orange-500',
          duration: 5000,
        });
        return;
      }   

      const res: globalThis.Response = await fetch(`${BACKEND_PINS_API_URL}${event.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const jsonRes: { message: string } = await res.json();

      if (!res.ok) {
       throw new Error(jsonRes.message);
      }

      await pinsContext?.fetchPinnedEvents();

      toast({
        title: 'Event un-pinned!',
        description: `${event.name} has been removed from your pinned events.`,
        className: 'text-[hsl(var(--text-color))] bg-green-600',
        duration: 5000,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: `Uh oh.`,
          description: error.message,
          variant: 'destructive',
          duration: 5000,
        });
      }
    }
  };

  const isPinned = (eventId: string): boolean => {
    if(!pinsContext || !pinsContext.pinnedEvents || pinsContext.pinnedEvents?.length === 0) {
      return false;
    }
    return pinsContext.pinnedEvents.some((event) => event.event_id === eventId);
  };

  // Set the visible events.
  useEffect(() => {
    if (data) {
      const dataMap = data.pages.flatMap((page) => page.events);
      setVisibleEvents([...dataMap.slice(0, numVisible)]);
    }
  }, [data, numVisible]);

  // Hide the button that shows more events when fetching the next page fails.
  useEffect(() => {
    setHasMore(false)
  }, [isFetchNextPageError]);

  
  useEffect(() => {
    const getPinnedEvents = async () => {
      if (!pinsContext?.pinnedEvents || pinsContext.pinnedEvents?.length === 0) {
        await pinsContext?.fetchPinnedEvents();
      }
    };
    getPinnedEvents();
  }, [pinsContext]);

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

  if ((error && !isFetchNextPageError) || (!(data?.pages.flatMap((page) => page.events).length) && !hasMore)) {
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

  return (
    <>
      <div className='flex flex-col items-center w-full'>
        {visibleEvents?.map((event) => {
          const pinned = isPinned(event.id);
          return(
            <Event 
              key={event.id} 
              event={event} 
              path={path} 
              handlePin={handlePin} 
              handleUnpin={handleUnpin} 
              pinned={pinned}/>
          )
        })}
        {isFetching &&
          <div className='flex justify-center bg-[hsl(var(--background))] text-[hsl(var(--text-color))] w-fit p-4 rounded-2xl'>
          <Loader className='text-[hsl(var(--text-color))] animate-spin'/>
          <p className='ml-1 text-center'>Loading events... </p>
        </div>
        }
        <button 
          className={
            !data || 
            !hasMore || 
            ((data.pages.flatMap((page) => page.events).length <= 10) && (typeof data.pages[0].nextPage) !== 'number')
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
