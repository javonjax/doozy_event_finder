import { GenreData } from "@/schemas/schemas";

interface CategoryFiltersProps {
  path: string;
  genres: Array<GenreData> | null | undefined;
  selectedGenre: string;
  handleGenreChange: React.ChangeEventHandler<HTMLSelectElement>;
  useLocationData: boolean;
  onCheckBox: React.ChangeEventHandler<HTMLInputElement>; 
}

const CategoryFilters = ({path, genres, selectedGenre, handleGenreChange, useLocationData, onCheckBox} : CategoryFiltersProps) => {
  return (
    <div className='flex flex-col w-full items-center justify-center bg-[hsl(var(--background))] rounded-2xl py-8 my-4'>
        <div className='flex flex-col md:flex-row justify-evenly items-center w-full'>
          {genres?.length && (
            <div className='flex flex-col text-center md:flex-row  w-[60%] md:w-fit mb-4 md:mb-0'>
              <label htmlFor='subcategory-select' className='text-[hsl(var(--text-color))] mr-4'>Subcategory:</label>
              <select
                className='p-1 w-full'
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
          <div className='flex flex-col text-center md:flex-row mb-4 md:mb-0'>
            <label className='mr-2 text-[hsl(var(--text-color))]'>Start date:</label>
            <input type='date'></input>
          </div>
          <div className='flex flex-col text-center md:flex-row mb-4 md:mb-0'>
            <label className='mr-2 text-[hsl(var(--text-color))]'>End date:</label>
            <input type='date'></input>
          </div>
        </div>
        {path.toLowerCase() !== 'local' && (
          <div className='mt-4'>
            <input
              type='checkbox'
              id='location-checkbox'
              checked={useLocationData}
              onChange={onCheckBox}
            />
            <label htmlFor='location-checkbox' className='ml-2 text-[hsl(var(--text-color))]'>Search near your location</label>
          </div>
        )}
      </div>
  );
};

export default CategoryFilters;
