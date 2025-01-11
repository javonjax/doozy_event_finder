import Row from './Row';
import Card from './Card';
import { useToast } from '@/hooks/use-toast';
import { Music, Trophy, Film, Drama, Puzzle, Flame, Radar } from 'lucide-react';
import { useContext } from 'react';
import { LocationContext, LocationContextProvider } from '../Providers/LocationContext';
import { NavigateFunction, useNavigate } from 'react-router-dom';


const Home = (): React.JSX.Element => {
  const locationContext = useContext<LocationContextProvider | undefined>(
    LocationContext
  );
  const navigate: NavigateFunction = useNavigate();
  const { toast } = useToast();

  const handleClickLocalCard: React.MouseEventHandler<HTMLAnchorElement> = 
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): Promise<void> => {
        e.preventDefault();
        if (!locationContext) {
          console.log('Location context is unavailable.');
          return;
        }
        try {
          const { requestLocation} = locationContext;
          await requestLocation();
          console.log(location)
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
            color='orange'
            icon={<Flame size={156}/>}
          />
          <Card
            path={`/local`}
            label='Local'
            icon={<Radar size={156} className='ml-2'/>}
            onClick={handleClickLocalCard}
          />
        </Row>
        <Row>
          <Card
            path={`/music`}
            label='Music'
            icon={<Music size={156}/>}
          />
          <Card
            path={`/sports`}
            label='Sports'
            icon={<Trophy size={156}/>}
          />
          <Card
            path={`/arts`}
            label='Arts'
            icon={<Drama size={156}/>}
          />
        </Row>
        <Row>
          <Card
            path={`/film`}
            label='Film'
            icon={<Film size={156}/>}
          />
          <Card
            path={`/misc`}
            label='Misc'
            icon={<Puzzle size={156}/>}
          />
        </Row>
      </div>
    </div>
  );
};

export default Home;
