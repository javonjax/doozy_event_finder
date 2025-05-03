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
  setQueryDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const CategoryFilters = ({
  path,
  genres,
  selectedSubcategory,
  handleSubcategoryChange,
  useLocationData,
  onCheckBox,
  date,
  setDate,
  setQueryDate,
}: CategoryFiltersProps) => {
  // Set the subcategory
  useEffect(() => {
    handleSubcategoryChange();
  }, [path, handleSubcategoryChange]);

  return (
    <div className="my-4 flex w-full flex-col items-center justify-center rounded-2xl bg-[hsl(var(--background))] py-8">
      <div className="flex w-full flex-col items-center justify-evenly xl:flex-row">
        <SubCategoryDropdown
          subcategories={genres}
          selectedSubcategory={selectedSubcategory}
          handleSubCategoryChange={handleSubcategoryChange}
        />
        <DateRangePicker
          className="text-[hsl(var(--text-color))]"
          date={date}
          setDate={setDate}
          setQueryDate={setQueryDate}
        />
      </div>
      {path.toLowerCase() !== "local" && (
        <div className="mt-4 cursor-pointer">
          <input
            className="cursor-pointer"
            type="checkbox"
            id="location-checkbox"
            checked={useLocationData}
            onChange={onCheckBox}
          />
          <label
            htmlFor="location-checkbox"
            className="ml-2 cursor-pointer text-[hsl(var(--text-color))]"
          >
            Search near your location
          </label>
        </div>
      )}
    </div>
  );
};

export default CategoryFilters;
