import { useContext, useEffect, useState } from 'react';
import { PinsContext, PinsContextProvider } from '../Providers/PinsContext';
import { Pin } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';


const PinnedEvents = () => {
  const pinsContext: PinsContextProvider | undefined = useContext<PinsContextProvider | undefined>(PinsContext);
  const [boxDates, setBoxDates] = useState<Array<[string, string, string]>>();
  
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
    const getMonthsAndYears = pinsContext?.pinnedEvents?.reduce<Array<[string, string, string]>>((acc, event) => {
      const [yearNum, monthNum]: Array<string> = event.event_date.split('-');
      const monthNames: Array<string> = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const monthStr = monthNames[Number(monthNum) - 1];
      if (!acc.some((item) => item[0] === monthStr && item[1] === yearNum)) {
        acc.push([monthStr, yearNum, monthNum]);
      }
      return acc;
    }, []);

    getPinnedEvents();
    setBoxDates(getMonthsAndYears);
  }, [pinsContext]);

  return (
    <div className='max-w-7xl w-full h-full'>
      <div className='flex flex-wrap items-start justify-center p-4 w-full h-full'>
        {!pinsContext?.pinnedEvents && (
          <div className='bg-[hsl(var(--background))] text-[hsl(var(--text-color))] p-4 rounded-2xl flex'>
            You have no pinned events. Click the{' '}
            <Pin className='-rotate-45 mx-2' /> on an event to add it to your
            pinned list.
          </div>
        )}
        {boxDates?.map((item) => {
          return (
            <div 
              key={`${item[0]}, ${item[1]} pins box}`}
              className='bg-[hsl(var(--background))] text-[hsl(var(--text-color))] p-4 rounded-2xl flex flex-col items-center m-4 max-w-[30%]'>
              <div className='text-3xl'>
                {item[0]} {item[1]}
              </div>
              {pinsContext?.pinnedEvents?.map((event) => {
                const [yearNum, monthNum]: Array<string> = event.event_date.split('-');
                if (item[1] === yearNum && item[2] === monthNum) {
                  return (
                    <DropdownMenu 
                      key={event.id}
                      modal={false}>
                      <DropdownMenuTrigger 
                        className='z-10 text-[hsl(var(--text-color))]'>
                        {event.event_name}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className='text-[hsl(var(--text-color))] p-4 flex flex-col items-center'>
                        <img src={event.img_url}/>
                        <div>
                          {event.event_name}
                        </div>
                        <div>
                          {event.event_date}, {event.event_time}
                        </div>
                        <button>info</button>
                        <button>get tickets</button>
                        <button>delete pin</button>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                } else {
                  return;
                }
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PinnedEvents;
