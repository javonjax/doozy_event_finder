import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const CategoryHeader = (): React.JSX.Element => {
  const path: string = useLocation().pathname.slice(1).toLowerCase();
  return (
    <div
      className='w-full h-[250px] relative overflow-hidden rounded-2xl my-4 bg-cover bg-center'
      style={{backgroundImage: `url('${path}_header.webp')`,}}
    >
      <div className='absolute top-4 left-4 bg-[hsl(var(--background))] p-4 rounded-2xl text-[hsl(var(--text-color))]'>
        <NavLink to={'/'}>Home</NavLink>
        <span> / </span>
        <NavLink to={`/${path}`}>
          {path.charAt(0).toUpperCase() + path.slice(1)}
        </NavLink>
      </div>
    </div>
  );
};

export default CategoryHeader;
