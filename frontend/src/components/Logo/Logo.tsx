import { Ticket } from 'lucide-react';

const Logo = () => {
  return (
    <div className='flex items-center p-2 text-white'>
      <Ticket className='-rotate-45'/><span className='text-3xl ml-1'>Doozy</span>
    </div>
  );
};

export default Logo;
