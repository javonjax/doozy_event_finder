import { z } from 'zod';

export interface ApiData {
    _embedded: {
        events: Event[]
    }
}

export interface Event {
    name: string,
    id: string,
    dates: {
        start: {
            localDate?: string,
            localTime?: string,
            dateTime?: string
        }
    },
    priceRanges: {
        currency?: string,
        min?: number,
        max?: number
    },
    _embedded:{
        venues?: {
            name?: string,
            id?: string,
            images?: any,
            city: {
                name?: string
            },
            state: {
                name?: string
            }
        }[]
    },
    [index: string]: unknown
}
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