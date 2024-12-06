// Converts date from YYYY-MM-DD to Weekday, Month DD.
const formatDate = (dateString: string): string => {
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
const formatTime = (timeString: string): string => {
  const [hours24, mins]: number[] = timeString.split(':').map(Number);
  const period: string = hours24 >= 12 ? 'PM' : 'AM';
  const hours: number = hours24 % 12 || 12;
  const formattedTime: string = `${hours}:${mins} ${period}`;

  return formattedTime;
};

export { formatDate, formatTime };