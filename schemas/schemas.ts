import { z } from 'zod';

/******************************************************** BACKEND ********************************************************/
export const VenueSchema = z.object({
  name: z.string(),
  address: z.record(z.string(), z.string()),
  city: z.object({
    name: z.string(),
  }),
  state: z
    .object({
      name: z.string().optional(),
      stateCode: z.string().optional(),
    })
    .refine((data) => data.name !== undefined || data.stateCode !== undefined, {
      message: 'Name or state code must be present.',
    }),
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
    Basic structure of Ticketmaster api responses containing events.
    Used in:
        /events dataRoute
*/
export const TicketmasterEventsData = z.object({
    _embedded: z.object({
        events: z.array(
            z.record(z.string(), z.unknown())
        )
    })
});

/*
    Contains information about a genre.
    Used in:
         /genres/:route
*/
export const GenreSchema = z.object({
    id: z.string(),
    name: z.string()
});

export const GenreArraySchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  })
);

export type GenreData = z.infer<typeof GenreSchema>;

/*
    Contains a list of genres under a classification.
    Used in: 
        /genres/:route
*/
export const ClassificationSchema = z.object({
    segment: z.object({
        id: z.string(),
        name: z.string(),
        _embedded: z.object({
            genres: z.array(
                GenreSchema
            )
        })
    })
});

export type ClassificationData = z.infer<typeof ClassificationSchema>;


/*
    Basic structure of Ticketmaster api responses containing classifications.
    Used in:
        /genres/:route dataRoute
*/
export const TicketMasterClassificationData = z.object({
    _embedded: z.object({
        classifications: z.array(
            z.record(z.string(), z.unknown())
        )
    })
});

/******************************************************** BACKEND ********************************************************/


/******************************************************** FRONTEND ********************************************************/

/*
    Used in: components/Events/EventList
*/
export const EventsAPIResSchema = z.object({
    events: z.array(
        EventCardSchema
    ),
    nextPage: z.number().nullable()
});

export type EventsAPIRes = z.infer<typeof EventsAPIResSchema>;
/******************************************************** FRONTEND ********************************************************/