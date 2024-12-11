import { categories } from '@/schemas/schemas';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import { NavLink } from 'react-router-dom';
import { Menu, UserRound, LogIn, PenLine } from 'lucide-react';
import NavBarItem from './NavBarItem';
import Logo from '../Logo/Logo';



const NavBar = (): React.JSX.Element => {
  return (
    <div className='bg-[hsl(var(--background))]'>
      <Menubar className='h-20 flex justify-between max-w-7xl mx-auto border-0 p-0 rounded-none'>
        <MenubarMenu>
          <div>
            <NavLink to='/'>
              <Logo/>
            </NavLink>
          </div>
          {/* Normal navbar for larger screens. */}
          <div className='items-center hidden md:flex'>
            {categories.map((cat: string): React.JSX.Element => {
              return (
                <NavBarItem
                  key={`${cat}-nav`}
                  path={`/${cat}`}
                  label={cat}
                />
              );
            })}
            <MenubarMenu>
              <MenubarTrigger className='text-[hsl(var(--text-color))] mx-0 p-4 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground'>
                <UserRound size={20}/>
              </MenubarTrigger>
              <MenubarContent className='text-[hsl(var(--text-color))] hidden md:block'>
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
          {/* Hamburger menu for small screens. */}
          <div className='md:hidden'>
            <MenubarMenu>
              <MenubarTrigger className='text-[hsl(var(--text-color))] mx-0 p-4 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground'>
                <Menu />
              </MenubarTrigger>
              <MenubarContent className='text-[hsl(var(--text-color))] md:hidden'>
                {categories.map((cat) => {
                  return (
                    <>
                    <NavLink
                      key={`${cat}-nav`}
                      to={`/${cat}`}
                    >
                      <MenubarItem>
                        {cat}
                      </MenubarItem>
                      <MenubarSeparator />
                    </NavLink>
                    </>
                  )
                })}
                <MenubarItem>
                  Login <MenubarShortcut><LogIn size={20}/></MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator/>
                <MenubarItem>
                  Sign up <MenubarShortcut><PenLine size={20}/></MenubarShortcut>
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
