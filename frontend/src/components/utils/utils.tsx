// Converts date from YYYY-MM-DD to Weekday, Month DD.
export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    weekday: "short",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
};

// Converts time from 24hr to 12hr format.
export const formatTime = (timeString: string): string => {
  const [hours24, mins] = timeString.split(":");
  const period = Number(hours24) >= 12 ? "PM" : "AM";
  const hours = Number(hours24) % 12 || 12;
  const formattedTime = `${hours}:${mins} ${period}`;

  return formattedTime;
};
