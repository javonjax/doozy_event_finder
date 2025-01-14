import { NavLink } from 'react-router-dom';
import { ColorClasses } from '@/schemas/schemas';
import clsx from 'clsx';

export interface HomeCardProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const Card = ({ path, label, icon, onClick, color }: HomeCardProps): React.JSX.Element => {
  const handleCardClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  // Control the card colors with props.
  let colors: string;
  if (color && Object.keys(ColorClasses).includes(color)) {
    colors = ColorClasses[color];
  } else {
    colors = 'bg-black text-white hover:bg-white hover:text-black';
  }

  return (
    <NavLink
      className={clsx('cursor-pointer min-h-[175px] border-2 h-[250px] w-[70%] md:w-[30%] md:h-full flex rounded-2xl overflow-hidden relative transform transition-all duration-400 hover:scale-105', colors)}
      onClick={handleCardClick}
      to={path}>
      <div className={`absolute top-2 left-0 ${path === '/popular' ? 'text-orange-400': ''}`}>
        {icon}
      </div>
      <label className='absolute bottom-4 right-4 text-[1.5rem] cursor-pointer'>{label}</label>
    </NavLink>
  );
};

export default Card;
