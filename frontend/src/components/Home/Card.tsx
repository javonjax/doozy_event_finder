import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { ColorClasses, HomeCardProps } from '@/schemas/schemas';

const Card = ({ path, label, icon, color }: HomeCardProps): React.JSX.Element => {
  const colors = ColorClasses[color] || '';
  return (
    <NavLink
      className={clsx('cursor-pointer border-2 h-[250px] w-[70%] md:w-[30%] md:h-full flex rounded-2xl overflow-hidden relative transform transition-all duration-400 hover:scale-105', colors)}
      to={path}>
      <div className={clsx(`absolute top-[-4px] left-[-4px]`)}>
        {icon}
      </div>
      <label className='text-white absolute bottom-4 right-4 text-[1.5rem] cursor-pointer'>{label}</label>
    </NavLink>
  );
};

export default Card;
