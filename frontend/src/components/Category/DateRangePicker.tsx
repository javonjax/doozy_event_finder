import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangePickerProps {
    className: string;
    date: DateRange | undefined;
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
    setQueryDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const DateRangePicker = ({className, date, setDate, setQueryDate}: DateRangePickerProps): React.JSX.Element => {
  const handleSumbmit = () => {
    setQueryDate(date);
  };

  const handleReset = () => {
    setDate({from: undefined, to: undefined})
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}>
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0 text-[hsl(var(--text-color))] flex flex-col items-center' avoidCollisions={false}>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={new Date()}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className='flex self-start'>
            <Button 
              className='ml-3 mb-3 bg-[hsl(var(--background))] border-white border-2 w-fit p-2 rounded-2xl hover:bg-white hover:text-black'
              onClick={handleSumbmit}>
              Submit
            </Button>
            <Button 
              className='ml-3 mb-3 bg-[hsl(var(--background))] border-white border-2 w-fit p-2 rounded-2xl hover:bg-white hover:text-black'
              onClick={handleReset}>
              Reset
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
