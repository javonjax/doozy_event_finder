import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const CategoryHeader = (): React.JSX.Element => {
  const route = useLocation().pathname.slice(1);
  return (
    <div
      className='w-full h-[250px] relative overflow-hidden rounded-2xl my-4'
      style={{backgroundImage: `url('music_header.jpg')`,}}
    >
      <div className='absolute top-4 left-4 bg-black p-4 rounded-2xl text-[hsl(var(--text-color))]'>
        <NavLink to={'/'}>Home</NavLink>
        <span> / </span>
        <NavLink to={`/${route}`}>
          {route.charAt(0).toUpperCase() + route.slice(1)}
        </NavLink>
      </div>
    </div>
  );
};

export default CategoryHeader;
