import Row from './Row';
import Card from './Card';
import { useToast } from '@/hooks/use-toast';
import { Music, Trophy, Film, Drama, Puzzle, Flame, Radar } from 'lucide-react';
import { useContext } from 'react';
import { LocationContext } from '../Providers/LocationContext';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { LocationContextHelper } from '@/schemas/schemas';

const Home = (): React.JSX.Element => {
  const context = useContext<LocationContextHelper | undefined>(
    LocationContext
  );
  const navigate: NavigateFunction = useNavigate();
  const { toast } = useToast();

  const handleClickLocalCard: React.MouseEventHandler<HTMLAnchorElement> = 
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): Promise<void> => {
        e.preventDefault();
        if (!context) {
          console.log('Location context is unavailable.');
          return;
        }
        try {
          const { requestLocation } = context;
          await requestLocation();
        navigate('/local');
        } catch (error) {
          toast({
            title: 'Location Services Required',
            description: 'Please enable location services to see local events.',
            variant: 'destructive',
            duration: 5000,
          });
        }
  };

  return (
    <div className='max-w-7xl w-full h-full flex flex-col items-center'>
      <div className='w-full flex flex-col items-center mt-8 text-[hsl(var(--text-color))]'>
        <h1 className='text-[2rem] text-center'>
          Finding something to do has never been easier.
        </h1>
        <h2 className='text-[1.4rem] text-center'>
          Pick a category to get started.
        </h2>
      </div>
      <div className='w-full grow flex flex-col items-center gap-16 p-8'>
        <Row>
          <Card
            path={`/popular`}
            label='Popular'
            icon={<Flame size={164} />}
          />
          <Card
            path={`/local`}
            label='Local'
            icon={<Radar size={164} />}
            onClick={handleClickLocalCard}
          />
        </Row>
        <Row>
          <Card
            path={`/music`}
            label='Music'
            icon={<Music size={164} />}
          />
          <Card
            path={`/sports`}
            label='Sports'
            icon={<Trophy size={164} />}
          />
          <Card
            path={`/arts`}
            label='Arts'
            icon={<Drama size={164} />}
          />
        </Row>
        <Row>
          <Card
            path={`/film`}
            label='Film'
            icon={<Film size={164} />}
          />
          <Card
            path={`/misc`}
            label='Misc'
            icon={<Puzzle size={164} />}
          />
        </Row>
      </div>
    </div>
  );
};

export default Home;
