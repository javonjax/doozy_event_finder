import { z } from 'zod';

export const Venue = z.object({
    name: z.string(),
    address: z.record(z.string(), z.string()),
    city: z.record(z.string(), z.string()),
    state: z.record(z.string(), z.string())
});

/*
    /events route
    Contains general information about events to be displayed on cards
*/ 
export const EventCardSchema = z.object({
    name: z.string(),
    id: z.string(),
    url: z.string().url(),
    dates: z.object({
        start: z.object({
            localDate: z.string().date(),
            localTime: z.string().time(),
            dateTime: z.string().datetime()
        })
    }),
    priceRanges: z.object({
        currency: z.string(),
        min: z.number(),
        max: z.number()
    }),
    _embedded: z.object({
        venues: z.array(Venue)
    })
});

export const EventCardsData = z.array(EventCardSchema);