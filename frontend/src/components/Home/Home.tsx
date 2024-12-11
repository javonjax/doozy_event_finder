import HomeCard from "./HomeCard";
import { Music, Trophy, Film, Drama, Puzzle } from 'lucide-react';

const Home = (): React.JSX.Element => {
  return (
    <div className='max-w-7xl w-full h-full flex flex-col items-center'>
        <div className='w-full flex flex-col items-center mt-8 text-[hsl(var(--text-color))]'>
            <h1 className='text-[2rem]'>
                Finding something to do has never been easier.
            </h1>
            <h2 className='text-[1.4rem]'>
                Pick a category to get started.
            </h2>
        </div>
        <div className='w-full grow flex flex-col items-center gap-16 m-16'>
            <div className='w-full flex grow justify-center items-center gap-16'>
                <HomeCard path={`/music`} label='Music' icon={<Music size={164}/>} color='orange'/>
                <HomeCard path={`/sports`} label='Sports' icon={<Trophy size={164}/>} color='green'/>
                <HomeCard path={`/film`} label='Film' icon={<Film size={164}/>} color='violet'/>
            </div>
            <div className='w-full flex grow justify-center items-center gap-16'>
                <HomeCard path={`/arts`} label='Arts' icon={<Drama size={164}/>} color='pink'/>
                <HomeCard path={`/misc`} label='Misc' icon={<Puzzle size={164}/>} color='slate'/>
            </div>
        </div>
    </div>
  );
};

export default Home;
