import { NavLink } from 'react-router-dom';
import { HomeCardProps } from '@/schemas/schemas';

const Card = ({ path, label, icon, onClick }: HomeCardProps): React.JSX.Element => {

  const handleCardClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <NavLink
      className='cursor-pointer border-2 h-[250px] w-[70%] md:w-[30%] md:h-full flex rounded-2xl overflow-hidden relative transform transition-all duration-400 hover:scale-105 bg-neutral-500 text-neutral-400'
      onClick={handleCardClick}
      to={path}>
      <div className='absolute top-[-4px] left-[-4px]'>
        {icon}
      </div>
      <label className='text-[hsl(var(--text-color))] absolute bottom-4 right-4 text-[1.5rem] cursor-pointer'>{label}</label>
    </NavLink>
  );
};

export default Card;
