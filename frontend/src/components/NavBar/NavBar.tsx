import { Menubar, MenubarMenu } from '@/components/ui/menubar';
import { FaHome } from 'react-icons/fa';
import NavBarItem from './NavBarItem';

export const categories: Array<string> = ['Sports', 'Music', 'Film', 'Arts', 'Misc'];

const NavBar = (): React.JSX.Element => {
  return (
    <div className='bg-black'>
      <Menubar className='h-20 flex justify-start bg-black max-w-7xl mx-auto border-0 rounded-none'>
        <MenubarMenu>
          <NavBarItem path='/' label={<FaHome size={24} />} />
          {categories.map((category: string): React.JSX.Element => {
            return <NavBarItem path={`/${category}`} label={category} />;
          })}
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default NavBar;
