import { MenubarTrigger } from '@/components/ui/menubar';

interface NavBarItemProps {
    path: string, 
    label: React.ReactNode
};

const NavBarItem = ({path, label}: NavBarItemProps): React.JSX.Element => {
  return (
    <MenubarTrigger className='bg-black text-white mx-0 p-4'>
      <a href={`/${path}`}>
        {label}
      </a>
    </MenubarTrigger>
  );
};

export default NavBarItem;
