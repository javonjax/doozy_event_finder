import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { colorClasses } from '@/schemas/schemas';

interface HomeCardProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const HomeCard = ({ path, label, icon, color }: HomeCardProps): React.JSX.Element => {
  const colors = colorClasses[color] || '';
  return (
    <NavLink
      className={clsx('cursor-pointer border-2 w-[30%] h-full flex rounded-2xl overflow-hidden relative transform transition-all duration-400 hover:scale-105', colors)}
      to={path}>
      <div className={clsx(`absolute top-4 left-8`)}>
        {icon}
      </div>
      <label className='text-white absolute bottom-4 right-4 text-[1.5rem] cursor-pointer'>{label}</label>
    </NavLink>
  );
};

export default HomeCard;
