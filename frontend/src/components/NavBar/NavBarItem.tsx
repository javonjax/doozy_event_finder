import { MenubarTrigger } from '@/components/ui/menubar';
import { NavLink } from 'react-router-dom';

interface NavBarItemProps {
    path: string, 
    label: React.ReactNode
};

const NavBarItem = ({path, label}: NavBarItemProps): React.JSX.Element => {
  return (
    <NavLink to={`${path.toLowerCase()}`}>
      <MenubarTrigger className='text-[hsl(var(--text-color))] mx-0 p-4'>
          {label}
      </MenubarTrigger>
    </NavLink>
  );
};

export default NavBarItem;
