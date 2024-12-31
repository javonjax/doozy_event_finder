import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Skeleton } from '../ui/skeleton';


const CategoryHeader = (): React.JSX.Element => {
  const path: string = useLocation().pathname.slice(1).toLowerCase();
  const lowQualityImg: string = `${path}_header_lq.webp`;
  const highQualityImg: string = `${path}_header.webp`;
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    setIsLoaded(false);
    const img = new Image();
    img.src = highQualityImg;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, [highQualityImg]);

  return (
    <div className='w-full h-[250px] relative overflow-hidden rounded-2xl my-4 bg-cover bg-center'>
      {!isLoaded && <Skeleton className={`w-full h-full bg-white/10 transition-opacity ${isLoaded ? 'opacity-0' : 'opacity-100'}`}/>}
      <img
        loading='lazy'
        src={highQualityImg}
        alt={`${path} category header image.`}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
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
