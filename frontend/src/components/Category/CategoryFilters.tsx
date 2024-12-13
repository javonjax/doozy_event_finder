const CategoryFilters = () => {
  return (
    <div className='category-filters'>
      <div className='filter-dropdowns-container'>
        {genres?.length && (
          <div className='filter-dropdown'>
            <label htmlFor='subcategory-select'>Subcategory:</label>
            <select
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
        <div className='filter-dropdown'>
          <label>Start date:</label>
          <input type='date'></input>
        </div>
        <div className='filter-dropdown'>
          <label>End date:</label>
          <input type='date'></input>
        </div>
      </div>
      {route.toLowerCase() !== 'local' && (
        <div className='use-location-checkbox'>
          <input
            type='checkbox'
            id='location-checkbox'
            checked={useLocationData}
            onChange={onCheckBox}
          />
          <label htmlFor='location-checkbox'>Search near your location</label>
        </div>
      )}
    </div>
  );
};

export default CategoryFilters;
