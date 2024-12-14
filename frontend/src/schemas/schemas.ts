import { z } from 'zod';



export const Categories: Array<string> = [
  'Sports',
  'Music',
  'Film',
  'Arts',
  'Misc',
];

/*
  Used in: components/NavBar/NavBarItem
*/
export interface NavBarItemProps {
  path: string;
  label: React.ReactNode;
};

/*
  Used in: components/Home/Card
*/
export interface HomeCardProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

/*
  Used in: components/Home/Card
*/
export const ColorClasses: Record<string, string> = {
  slate: 'bg-slate-500 text-slate-400',
  violet: 'bg-violet-500 text-violet-400',
  green: 'bg-green-500 text-green-400',
  orange: 'bg-orange-500 text-orange-400',
  pink: 'bg-pink-500 text-pink-400',
};

/*
  Used in: components/Providers/LocationContext
*/
export type Coordinates =  Pick<GeolocationCoordinates, 'latitude' | 'longitude'>;

/*
  Used in: components/Providers/LocationContext
*/
export interface LocationContextHelper {
  location?: Coordinates,
  error?: string,
  requestLocation: () => Promise<Coordinates>
};

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

export interface EventListProps {
  selectedGenre?: string;
  location?: Coordinates;
  path: string;
};

