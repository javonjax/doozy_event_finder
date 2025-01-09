import { useContext, useEffect } from "react";
import { PinsContext, PinsContextProvider } from "../Providers/PinsContext";

const PinnedEvents = () => {
  const pinsContext: PinsContextProvider | undefined = useContext<PinsContextProvider | undefined>(PinsContext);
  useEffect(() => {
    const getPinnedEvents = async () => {
      if (!pinsContext?.pinnedEvents || pinsContext.pinnedEvents?.length === 0) {
        await pinsContext?.fetchPinnedEvents();
      }
    };
    console.log('getting events')
    console.log(pinsContext?.pinnedEvents)
    getPinnedEvents();
  }, [pinsContext]);
  
  return (
    <div className='max-w-7xl w-full h-full'>
      <div className='flex flex-col border-2 border-white m-4'>
        {!pinsContext?.pinnedEvents && <div>there aint no events</div>}
        {pinsContext?.pinnedEvents?.map((event) => {
          return(
            <div>
              {
                `${event.event_name} ${event.event_date} ${event.event_time}`
              }
            </div>
          )
        })}


      </div>
        
    </div>
  );
};

export default PinnedEvents;
