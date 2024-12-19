import { GenreData } from "@/schemas/schemas";
import DateRangePicker from "./DateRangePicker";
import { DateRange } from "react-day-picker";

export interface CategoryFiltersProps {
  path: string;
  genres: Array<GenreData> | null | undefined;
  selectedGenre: string;
  handleGenreChange: React.ChangeEventHandler<HTMLSelectElement>;
  useLocationData: boolean;
  onCheckBox: React.ChangeEventHandler<HTMLInputElement>;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  setQueryDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
};

const CategoryFilters = ({path, genres, selectedGenre, handleGenreChange, useLocationData, onCheckBox, date, setDate, setQueryDate} : CategoryFiltersProps) => {
  return (
    <div className='flex flex-col w-full items-center justify-center bg-[hsl(var(--background))] rounded-2xl py-8 my-4'>
      <div className='flex flex-col xl:flex-row justify-evenly items-center w-full'>
        {genres?.length && (
          <div className='flex flex-col text-center xl:flex-row max-w-[60%] min-w-[300px] xl:w-fit mb-4 xl:mb-0'>
            <label
              htmlFor='subcategory-select'
              className='text-[hsl(var(--text-color))] mr-4'
            >
              Subcategory:
            </label>
            <select
              className='p-1 w-full min-w-[300px]'
              name='subcategory-select'
              value={selectedGenre}
              onChange={handleGenreChange}
            >
              <option value=''>Show all</option>
              {genres?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <DateRangePicker className='text-white' date={date} setDate={setDate} setQueryDate={setQueryDate}/>
      </div>
      {path.toLowerCase() !== 'local' && (
        <div className='mt-4'>
          <input
            type='checkbox'
            id='location-checkbox'
            checked={useLocationData}
            onChange={onCheckBox}
          />
          <label
            htmlFor='location-checkbox'
            className='ml-2 text-[hsl(var(--text-color))]'
          >
            Search near your location
          </label>
        </div>
      )}
    </div>
  );
};

export default CategoryFilters;
