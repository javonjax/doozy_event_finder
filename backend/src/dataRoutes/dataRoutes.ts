import 
express, 
{
  Request,
  Response,
  Router,
} from 'express';
import dotenv from 'dotenv';
import { sortByDateTime } from './utils';
import { ApiData, EventCardData, EventCardSchema } from '../schemas/schemas';


/*
  Environment variables.
*/ 
dotenv.config();
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const TICKETMASTER_EVENTS_API_URL = process.env.TICKETMASTER_EVENTS_API_URL;
const TICKETMASTER_SUGGEST_API_URL = process.env.TICKETMASTER_SUGGEST_API_URL;

const router: Router = express.Router();

/* 
    GET multiple events. 
*/
router.get(
  '/events',
  async (request: Request, response: Response): Promise<void> => {
    try {
      if (typeof TICKETMASTER_API_KEY !== 'string') {
        throw new Error('API key is not set.');
      }

      const apiKey: string = TICKETMASTER_API_KEY;

      const queryParams: string = new URLSearchParams({
        apikey: apiKey,
        size: '200',
        ...request.query,
      }).toString();

      const currentPage: number = Number(request.query.page);
    
      const res: globalThis.Response = await fetch(
        `${TICKETMASTER_EVENTS_API_URL}.json?${queryParams}`
      );

      if (!res.ok) {
        throw new Error(
          `Internal server error ${res.status}: ${res.statusText}`
        );
      }

      const ticketmasterData: unknown = await res.json();
      const parsedApiResponse = ApiData.safeParse(ticketmasterData);

      if (!parsedApiResponse.success) {
        throw new Error('Response data does not fit the desired schema.');
      }
      
      const numRetrieved: number = parsedApiResponse.data._embedded.events.length;

      if (!numRetrieved) {
        throw new Error('No events found.');
      }

      /*
        Remove items that do not fit the schema.
      */ 
      const validEvents: Array<EventCardData> =
        parsedApiResponse.data._embedded.events
          .map((item) => {
            const parsedEvent = EventCardSchema.safeParse(item);
            return parsedEvent.success
              ? parsedEvent.data
              : null;
          })
          .filter((item): item is EventCardData => item !== null);

      validEvents.sort(sortByDateTime);

      response.json({
        events: validEvents,
        nextPage:
          numRetrieved >= 200 && currentPage < 4 ? currentPage + 1 : null,
      });
    } catch (error) {
      console.log('Error fetching data from Ticketmaster:\n', error);
      response.status(500).json({ message: error });
    }
  }
);

export default router;
