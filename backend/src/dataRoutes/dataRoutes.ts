import express, { Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import { formatDate, formatTime } from './utils';
import { Event, ApiData } from '../schemas/schemas';

// Environment variables.
dotenv.config();
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const TICKETMASTER_EVENTS_API_URL = process.env.TICKETMASTER_EVENTS_API_URL;
const TICKETMASTER_SUGGEST_API_URL = process.env.TICKETMASTER_SUGGEST_API_URL;

const router: Router = express.Router();

/* 
    GET multiple events. 
*/
router.get('/events', async (request: Request, response: Response): Promise<void> => {
  try {
    const apiKey: string = TICKETMASTER_API_KEY as string; 
    

    if (!apiKey) {
        throw new Error('API key is not set.');
    }

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
      throw new Error(`Internal server error ${res.status}: ${res.statusText}`);
    }

    const ticketmasterData: ApiData = await res.json();
    const data: Event[] = ticketmasterData._embedded.events;
    console.log(data.length)
    response.json(data)

    // if (!data || !data?._embedded?.events) {
    //   throw new Error(`No data found.`);
    // }
    // console.log(data)
    // const events = data._embedded.events;

    // if (!events.length) {
    //   throw new Error(`No events found.`);
    // }

    // Filter to remove objects that are missing data.
    const eventFilter = (event: Event): boolean => {
      return (
        !!event.name &&
        !!event.id &&
        !!event.dates.start.localDate &&
        !!event.dates.start.localTime &&
        !!event.dates.start.dateTime &&
        !!event.priceRanges &&
        !!event._embedded &&
        !!event._embedded.venues &&
        !!event._embedded.venues[0].city &&
        !!event._embedded.venues[0].state
      );
    };


    // Retrieve information about events.
    // const eventDetails = events.filter(eventFilter).map((event) => {
    //   return {
    //     name: event.name,

    //     id: event.id,

    //     date: event.dates.start.localDate ? event.dates.start.localDate : null,

    //     time: event.dates.start.localTime ? event.dates.start.localTime : null,

    //     dateTimeUTC: event.dates.start.dateTime
    //       ? event.dates.start.dateTime
    //       : null,

    //     priceMin: event.priceRanges
    //       ? event.priceRanges[0].min + ' ' + event.priceRanges[0].currency
    //       : null,

    //     priceMax: event.priceRanges
    //       ? event.priceRanges[0].max + ' ' + event.priceRanges[0].currency
    //       : null,

    //     location:
    //       event._embedded.venues &&
    //       event._embedded.venues[0].city &&
    //       event._embedded.venues[0].state
    //         ? `${event._embedded.venues[0].city.name}, 
    //                 ${
    //                   event._embedded.venues[0].state.stateCode ||
    //                   event._embedded.venues[0].state.name
    //                 }`
    //         : null,

    //     venue: event._embedded.venues ? event._embedded.venues[0].name : null,
    //   };
    // });

    // // Sorts event objects based on local datetime.
    // const sortByDateTime = (a, b) => {
    //     const dateTimeA = new Date(a.date + 'T' + a.time + 'Z');
    //     const dateTimeB = new Date(b.date + 'T' + b.time + 'Z');
  
    //     return dateTimeA.getTime() - dateTimeB.getTime();
    // };

    // // Sort events.
    // eventDetails.sort(sortByDateTime);

    // // Convert local times to 12hr format.
    // eventDetails.forEach((event) => {
    //   event.time = formatTime(event.time);
    //   event.date = formatDate(event.date);
    // });

    // if (!eventDetails.length) {
    //   throw new Error(`No events found.`);
    // }

    // response.json({
    //   events: [...eventDetails],
    //   nextPage:
    //     events.length >= 200 && currentPage < 4 ? currentPage + 1 : null,
    // });
  } catch (error) {
    console.log('Error fetching data from Ticketmaster:\n', error);
    response.status(500).json({ message: error });
  }
});

export default router;
