import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { ColorClasses, HomeCardProps } from '@/schemas/schemas';

const Card = ({ path, label, icon, color, onClick }: HomeCardProps): React.JSX.Element => {
  const colors:string = ColorClasses[color] || '';

  const handleCardClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <NavLink
      className={clsx('cursor-pointer border-2 h-[250px] w-[70%] md:w-[30%] md:h-full flex rounded-2xl overflow-hidden relative transform transition-all duration-400 hover:scale-105', colors)}
      onClick={handleCardClick}
      to={path}>
      <div className={clsx(`absolute top-[-4px] left-[-4px]`)}>
        {icon}
      </div>
      <label className='text-[hsl(var(--text-color))] absolute bottom-4 right-4 text-[1.5rem] cursor-pointer'>{label}</label>
    </NavLink>
  );
};

export default Card;
