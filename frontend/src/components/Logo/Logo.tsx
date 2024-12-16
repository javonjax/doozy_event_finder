import { Ticket } from 'lucide-react';

const Logo = (): React.JSX.Element => {
  return (
    <div className='flex items-center p-2 text-[hsl(var(--text-color))]'>
      <Ticket className='-rotate-45 text-orange-400'/><span className='text-3xl ml-1'>Doozy</span>
    </div>
  );
};

export default Logo;
