import { NavLink } from 'react-router-dom';

interface HomeCardProps {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const HomeCard = ({ path, label, icon }: HomeCardProps): React.JSX.Element => {
  return (
    <NavLink
      className='text-white bg-slate-500 border-2 w-[30%] h-full flex rounded-2xl overflow-hidden relative'
      to={path}>
      <div className='absolute top-4 left-8'>
        {icon}
      </div>
      <h1 className='absolute bottom-4 right-4'>{label}</h1>
    </NavLink>
  );
};

export default HomeCard;
