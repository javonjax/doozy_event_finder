import { Categories } from '@/schemas/schemas';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import { NavigateFunction, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, UserRound, LogIn, PenLine, CalendarHeart, LogOut } from 'lucide-react';
import NavBarItem from './NavBarItem';
import Logo from '../Logo/Logo';
import { useContext } from 'react';
import { AuthContext, AuthContextProvider } from '../Providers/AuthContext';
import { useToast } from '@/hooks/use-toast';


// Environment variables.
const BACKEND_LOGOUT_API_URL: string = import.meta.env.VITE_BACKEND_LOGOUT_API_URL;

const NavBar = (): React.JSX.Element => {
  const path: string = useLocation().pathname.slice(1).toLowerCase();
  const navigate: NavigateFunction = useNavigate();
  const { toast } = useToast();
  const authContext = useContext<AuthContextProvider | undefined>(AuthContext);

  const userLogout = async (): Promise<void> => {
    try {  
      if (!authContext?.loggedIn) {
        toast({
          title: 'Logout error.',
          description: 'No active login session.',
          variant: 'destructive',
          duration: 5000,
        });
      }
      const res: Response = await fetch(BACKEND_LOGOUT_API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      });

      const jsonRes: { message: string } = await res.json();
      if (!res.ok) {
        throw new Error(jsonRes.message);
      }

      if (authContext) {
        authContext.logout();
      }
      
      if (path === 'pins') {
        navigate('/');
      }

      toast({
        title: 'Success!',
        className: 'text-[hsl(var(--text-color))] bg-green-600',
        description: jsonRes.message,
        duration: 5000,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Logout error.',
          description: error.message,
          variant: 'destructive',
          duration: 5000,
        });
     }
    }
  };
  
  return (
    <nav className='bg-[hsl(var(--background))] px-2'>
      <Menubar className='h-20 flex justify-between max-w-7xl mx-auto border-0 p-0 rounded-none'>
        <MenubarMenu>
          <div>
            <NavLink to='/'>
              <Logo />
            </NavLink>
          </div>
          {/* Normal navbar for larger screens. */}
          <div className='items-center hidden md:flex'>
            {Categories.map((cat: string): React.JSX.Element => {
              return (
                <NavBarItem key={`${cat}-nav`} path={`/${cat}`} label={cat} />
              );
            })}
            <MenubarMenu>
              <MenubarTrigger 
                className='text-[hsl(var(--text-color))] mx-0 p-4 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground'
                onClick={async () => await authContext?.getSession()}>
                <UserRound size={20} />
              </MenubarTrigger>
              <MenubarContent className='text-[hsl(var(--text-color))] hidden md:block'>
                {!authContext?.loggedIn &&
                  <>
                    <MenubarItem className='p-0'>
                      <NavLink
                        to='/login'
                        className='flex justify-between w-full h-full px-2 py-1.5'>
                        Login{' '}
                        <MenubarShortcut>
                          <LogIn size={16} className='text-orange-400'/>
                        </MenubarShortcut>
                      </NavLink>
                    </MenubarItem>
                    <MenubarSeparator/>
                    <MenubarItem className='p-0'>
                      <NavLink
                        to='/register'
                        className='flex justify-between w-full h-full px-2 py-1.5'>
                        Register{' '}
                        <MenubarShortcut>
                          <PenLine size={16} className='text-orange-400'/>
                        </MenubarShortcut>
                      </NavLink>
                    </MenubarItem>
                  </>
                }
                {authContext?.loggedIn && 
                  <>
                  <MenubarItem className='p-0'>
                    <NavLink
                      to='/pins'
                      className='flex justify-between w-full h-full px-2 py-1.5'>
                      Pinned Events{' '}
                      <MenubarShortcut>
                        <CalendarHeart size={16} className='text-orange-400' />
                      </MenubarShortcut>
                    </NavLink>
                  </MenubarItem>
                  <MenubarSeparator/>
                  <MenubarItem onClick={() => userLogout()}>
                      <div
                        className='flex justify-between w-full'>
                        Logout{' '}
                        <MenubarShortcut>
                          <LogOut size={16} className='text-orange-400' />
                        </MenubarShortcut>
                      </div>
                    </MenubarItem>
                    </>
                }
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
                {Categories.map((cat) => {
                  return (
                    <NavLink key={`${cat}-nav`} to={`/${cat}`}>
                      <MenubarItem className='cursor-pointer'>{cat}</MenubarItem>
                      <MenubarSeparator />
                    </NavLink>
                  );
                })}
                {!authContext?.loggedIn &&
                  <>
                    <MenubarItem className='p-0'>
                      <NavLink
                        to='/login'
                        className='flex justify-between w-full h-full px-2 py-1.5'>
                        Login{' '}
                        <MenubarShortcut>
                          <LogIn size={16} className='text-orange-400'/>
                        </MenubarShortcut>
                      </NavLink>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem className='p-0'>
                      <NavLink
                        to='/register'
                        className='flex justify-between w-full h-full px-2 py-1.5'>
                        Register{' '}
                        <MenubarShortcut>
                          <PenLine size={16} className='text-orange-400'/>
                        </MenubarShortcut>
                      </NavLink>
                    </MenubarItem>
                  </>
                }
                {authContext?.loggedIn && 
                  <>
                  <MenubarItem className='p-0'>
                    <NavLink
                      to='/pins'
                      className='flex justify-between w-full h-full px-2 py-1.5'>
                      Pinned Events{' '}
                      <MenubarShortcut>
                          <CalendarHeart size={16} className='text-orange-400'/>
                        </MenubarShortcut>
                    </NavLink>
                  </MenubarItem>
                  <MenubarSeparator/>
                  <MenubarItem className='p-0'>
                      <NavLink
                        to='/pins'
                        className='flex justify-between w-full h-full px-2 py-1.5'>
                        Logout{' '}
                        <MenubarShortcut>
                          <LogOut size={16} className='text-orange-400' />
                        </MenubarShortcut>
                      </NavLink>
                  </MenubarItem>
                  </>
                }
              </MenubarContent>
            </MenubarMenu>
          </div>
        </MenubarMenu>
      </Menubar>
    </nav>
  );
};

export default NavBar;
