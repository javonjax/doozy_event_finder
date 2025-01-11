import { z } from 'zod';


export const Categories: Array<string> = [
  'Sports',
  'Music',
  'Film',
  'Arts',
  'Misc',
];

/*
  Used in: components/Home/Card
*/
export const ColorClasses: Record<string, string> = {
  slate: 'bg-slate-500 text-slate-400',
  violet: 'bg-violet-500 text-violet-400',
  green: 'bg-green-500 text-green-400',
  orange: 'bg-orange-500 text-white hover:bg-white hover:text-black',
  pink: 'bg-pink-500 text-pink-400',
};

/*
  Used in: components/Providers/LocationContext
*/
export type Coordinates =  Pick<GeolocationCoordinates, 'latitude' | 'longitude'>;


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
