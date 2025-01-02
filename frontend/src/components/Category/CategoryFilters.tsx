import { GenreData } from "@/schemas/schemas";
import DateRangePicker from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import SubCategoryDropdown from "./SubCategoryDropdown";
import { useEffect } from "react";

export interface CategoryFiltersProps {
  path: string;
  genres: Array<GenreData> | null | undefined;
  selectedSubcategory: GenreData | undefined;
  handleSubcategoryChange: (item?: GenreData) => void;
  useLocationData: boolean;
  onCheckBox: React.ChangeEventHandler<HTMLInputElement>;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  setQueryDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
};

const CategoryFilters = ({path, genres, selectedSubcategory, handleSubcategoryChange, useLocationData, onCheckBox, date, setDate, setQueryDate} : CategoryFiltersProps) => {
  // Set the subcategory
  useEffect(() => {
    handleSubcategoryChange();
  }, [path]);

  return (
    <div className='flex flex-col w-full items-center justify-center bg-[hsl(var(--background))] rounded-2xl py-8 my-4'>
      <div className='flex flex-col xl:flex-row justify-evenly items-center w-full'>
        <SubCategoryDropdown 
          subcategories={genres}
          selectedSubcategory={selectedSubcategory}
          handleSubCategoryChange={handleSubcategoryChange}/>
        <DateRangePicker 
          className='text-[hsl(var(--text-color))]' 
          date={date} 
          setDate={setDate} 
          setQueryDate={setQueryDate}/>
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
