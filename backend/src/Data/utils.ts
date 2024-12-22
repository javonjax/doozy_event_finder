import {
  EventCardData,
  ClassificationData,
  Image,
  ImageSchema,
} from '../../../schemas/schemas';

// Converts date from YYYY-MM-DD to Weekday, Month DD.
export const formatDate = (dateString: string): string => {
  const [year, month, day]: number[] = dateString.split('-').map(Number);
  const date: Date = new Date(year, month - 1, day);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  };
  const formattedDate: string = date.toLocaleDateString('en-US', options);

  return formattedDate;
};

// Converts time from 24hr to 12hr format.
export const formatTime = (timeString: string): string => {
  const [hours24, mins]: number[] = timeString.split(':').map(Number);
  const period: string = hours24 >= 12 ? 'PM' : 'AM';
  const hours: number = hours24 % 12 || 12;
  const formattedTime: string = `${hours}:${mins} ${period}`;

  return formattedTime;
};

export const sortByDateTime = (a: EventCardData, b: EventCardData) => {
  const dateTimeA = new Date(
    a.dates.start.localDate + 'T' + a.dates.start.localTime + 'Z'
  );
  const dateTimeB = new Date(
    b.dates.start.localDate + 'T' + b.dates.start.localTime + 'Z'
  );

  return dateTimeA.getTime() - dateTimeB.getTime();
};

export const findImage = (images: Array<Image>): Array<Image> => {
  return images.filter((image: Image) => image.url.includes('ARTIST_PAGE'));
};

export const findGenres = (
  classifications: Array<ClassificationData>,
  searchTerm: string
) => {
  const classification: ClassificationData | undefined = classifications.find(
    (classification: ClassificationData) =>
      classification.segment.name.toLowerCase().includes(searchTerm)
  );

  if (!classification) {
    return undefined;
  }

  return classification.segment._embedded.genres;
};
