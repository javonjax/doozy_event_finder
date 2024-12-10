import { categories } from '@/schemas/schemas';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import { NavLink } from 'react-router-dom';
import { UserRound, LogIn, PenLine } from 'lucide-react';
import NavBarItem from './NavBarItem';
import Logo from '../Logo/Logo';



const NavBar = (): React.JSX.Element => {
  return (
    <div className='bg-black'>
      <Menubar className='h-20 flex justify-between bg-black max-w-7xl mx-auto border-0 p-0 rounded-none'>
        <MenubarMenu>
          <div>
            <NavLink to='/'>
              <Logo/>
            </NavLink>
          </div>
          <div className='flex items-center'>
            {categories.map((category: string): React.JSX.Element => {
              return (
                <NavBarItem
                  key={`${category}-nav`}
                  path={`/${category}`}
                  label={category}
                />
              );
            })}
            <MenubarMenu>
              <MenubarTrigger className='bg-black text-white mx-0 p-4'>
                <UserRound size={20}/>
              </MenubarTrigger>
              <MenubarContent className='bg-black text-white'>
                <MenubarItem>
                  Login <MenubarShortcut><LogIn/></MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator/>
                <MenubarItem>
                  Sign up <MenubarShortcut><PenLine/></MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </div>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default NavBar;
