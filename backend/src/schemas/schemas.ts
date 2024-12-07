import { z } from 'zod';

export const VenueSchema = z.object({
    name: z.string(),
    address: z.record(z.string(), z.string()),
    city: z.record(z.string(), z.string()),
    state: z.record(z.string(), z.string())
});

export const ImageSchema = z.object({
  url: z.string()
});
  
export type Image = z.infer<typeof ImageSchema>;

/*
    Contains general information about events to be displayed on cards.
    Used in: 
        /events dataRoute
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
        venues: z.array(VenueSchema)
    }),
    info: z.string().trim().optional(),
    description: z.string().trim().optional(),
    seatmap: z.object({
        staticUrl: z.string()
    }),
    images: z.array(
        ImageSchema
    )
});

export type EventCardData = z.infer<typeof EventCardSchema>;

/*
    Basic structure of Ticketmaster api responses.
    Used in:
        /events dataRoute
*/
export const TicketmasterApiData = z.object({
    _embedded: z.object({
        events: z.array(
            z.record(z.string(), z.unknown())
        )
    })
});
