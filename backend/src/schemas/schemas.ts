import { z } from 'zod';

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
    priceRanges: z.array(
        z.object({
            currency: z.string(),
            min: z.number(),
            max: z.number()
        })
    ),
    _embedded: z.object({
        venues: z.array(Venue)
    }),
    info: z.string().trim().optional(),
    description: z.string().trim().optional(),
    seatmap: z.object({
        staticUrl: z.string()
    }),
    images: z.array(
        z.object({
            url: z.string()
        })
    )
});

export const ApiData = z.object({
    _embedded: z.object({
        events: z.array(
            z.record(z.string(), z.unknown())
        )
    })
});

export const EventInfoSchema = EventCardSchema.extend({
    info: z.string().trim().optional(),
    description: z.string().trim().optional(),
    seatmap: z.object({
        staticUrl: z.string()
    }).optional(),
    images: z.array(
        z.object({
            url: z.string()
        })
    ).optional()
});

export type EventCardData = z.infer<typeof EventCardSchema>;


