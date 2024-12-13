import express, { Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import { sortByDateTime, findImage, findGenres } from './utils';
import {
  TicketmasterEventsData,
  TicketMasterClassificationData,
  EventCardData,
  EventCardSchema,
  ClassificationSchema,
  ClassificationData,
  GenreData,
} from '../../../schemas/schemas';

/*
  Environment variables.
*/
dotenv.config();
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const TICKETMASTER_EVENTS_API_URL = process.env.TICKETMASTER_EVENTS_API_URL;
const TICKETMASTER_CLASS_API_URL = process.env.TICKETMASTER_CLASS_API_URL;
const TICKETMASTER_SUGGEST_API_URL = process.env.TICKETMASTER_SUGGEST_API_URL;

const router: Router = Router();

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

      const responseData: unknown = await res.json();
      const parsedApiResponse = TicketmasterEventsData.safeParse(responseData);

      if (!parsedApiResponse.success) {
        throw new Error('Response data does not fit the desired schema.');
      }

      const numRetrieved: number =
        parsedApiResponse.data._embedded.events.length;

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
            return parsedEvent.success ? parsedEvent.data : null;
          })
          .filter((item): item is EventCardData => item !== null);

      // Sort by local dateTime
      validEvents.sort(sortByDateTime);

      // Find the appropriately sized image for the page header.
      validEvents.forEach((event) => {
        event.images = findImage(event.images);
      });

      response.json({
        events: validEvents,
        nextPage:
          numRetrieved >= 200 && currentPage < 4 ? currentPage + 1 : null,
      });
    } catch (error) {
      console.log('Error fetching data from Ticketmaster:\n', error);
      if (error instanceof Error) {
        response.status(500).json({ message: error.message });
      }
    }
  }
);

/*
    GET individual event by passing in an id.
*/
router.get(
  '/events/:id',
  async (request: Request, response: Response): Promise<void> => {
    try {
      if (typeof TICKETMASTER_API_KEY !== 'string') {
        throw new Error('API key is not set.');
      }

      const apiKey: string = TICKETMASTER_API_KEY;

      const queryParams: string = new URLSearchParams({
        apikey: apiKey,
        ...request.query,
      }).toString();

      const eventId: string = request.params.id;

      // Find the appropriately sized image for the info page header.

      const res: globalThis.Response = await fetch(
        `${TICKETMASTER_EVENTS_API_URL}/${eventId}.json?${queryParams}`
      );

      if (!res.ok) {
        throw new Error(
          `Internal server error ${res.status}: ${res.statusText}`
        );
      }

      const responseData: unknown = await res.json();
      
      const parsedApiResponse = EventCardSchema.safeParse(responseData);
     
      if (!parsedApiResponse.success) {
        throw new Error('Response data does not fit the desired schema.');
      }

      const event: EventCardData = parsedApiResponse.data;

      // Find the appropriately sized image for the page header.
      event.images = findImage(event.images);

      response.json(event);
    } catch (error) {
      console.log('Error fetching data from Ticketmaster:\n', error);
      if (error instanceof Error) {
        response.status(500).json({ message: error.message });
      }
    }
  }
);

/*
  GET genres from specified classification.
*/
router.get(
  '/genres/:path',
  async (request: Request, response: Response): Promise<void> => {
    try {
      if (typeof TICKETMASTER_API_KEY !== 'string') {
        throw new Error('API key is not set.');
      }

      const apiKey: string = TICKETMASTER_API_KEY;

      const queryParams: string = new URLSearchParams({
        apikey: apiKey,
        ...request.query,
      }).toString();

      const path: string = request.params.path.toLowerCase();

      const res: globalThis.Response = await fetch(
        `${TICKETMASTER_CLASS_API_URL}.json?${queryParams}`
      );

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      const responseData: unknown = await res.json();
      const parsedApiResponse =
        TicketMasterClassificationData.safeParse(responseData);

      if (!parsedApiResponse.success) {
        throw new Error('Response data does not fit the desired schema.');
      }

      const classifications = parsedApiResponse.data._embedded.classifications;

      const validClassifications: Array<ClassificationData> = classifications
        .map((item) => {
          const parsedClassification = ClassificationSchema.safeParse(item);
          return parsedClassification.success
            ? parsedClassification.data
            : null;
        })
        .filter((item): item is ClassificationData => item !== null);

      const genres: Array<GenreData> | undefined = findGenres(
        validClassifications,
        path
      );

      if (!genres) {
        throw new Error(
          `Could not find genres for classification type: ${path}.`
        );
      }

      response.json(genres);
    } catch (error) {
      console.log('Error fetching data from Ticketmaster:\n', error);
      if (error instanceof Error) {
        response.status(500).json({ message: error.message });
      }
    }
  }
);

export default router;
