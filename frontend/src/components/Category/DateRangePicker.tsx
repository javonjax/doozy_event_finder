import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DateRangePickerProps {
  className: string;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  setQueryDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const DateRangePicker = ({
  className,
  date,
  setDate,
  setQueryDate,
}: DateRangePickerProps): React.JSX.Element => {
  const handleSumbmit = () => {
    setQueryDate(date);
  };

  const handleReset = () => {
    setDate({ from: undefined, to: undefined });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-center border-orange-400 text-center font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Filter by date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="flex w-auto flex-col items-center p-0 text-[hsl(var(--text-color))]"
          avoidCollisions={true}
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={new Date()}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
          <div className="flex">
            <Button
              className="mb-3 ml-3 w-fit rounded-2xl border-2 border-white bg-[hsl(var(--background))] p-2 hover:bg-white hover:text-black"
              onClick={handleSumbmit}
            >
              Submit
            </Button>
            <Button
              className="mb-3 ml-3 w-fit rounded-2xl border-2 border-white bg-[hsl(var(--background))] p-2 hover:bg-white hover:text-black"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
