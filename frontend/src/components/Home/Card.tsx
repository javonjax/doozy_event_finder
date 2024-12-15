import { NavLink } from 'react-router-dom';
import { HomeCardProps } from '@/schemas/schemas';
import { ColorClasses } from '@/schemas/schemas';
import clsx from 'clsx';

const Card = ({ path, label, icon, onClick, color }: HomeCardProps): React.JSX.Element => {

  const handleCardClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  let colors: string;
  if (color && Object.keys(ColorClasses).includes(color)) {
    colors = ColorClasses[color];
  } else {
    colors = 'bg-neutral-500 text-neutral-400';
  }

  return (
    <NavLink
      className={clsx('cursor-pointer min-h-[175px] border-2 h-[250px] w-[70%] md:w-[30%] md:h-full flex rounded-2xl overflow-hidden relative transform transition-all duration-400 hover:scale-105', colors)}
      onClick={handleCardClick}
      to={path}>
      <div className='absolute top-2 left-0'>
        {icon}
      </div>
      <label className='text-[hsl(var(--text-color))] absolute bottom-4 right-4 text-[1.5rem] cursor-pointer'>{label}</label>
    </NavLink>
  );
};

export default Card;
