import HomeCard from "./HomeCard";
import Logo from "../Logo/Logo";
import { Music, Trophy, Film, Drama, Puzzle } from 'lucide-react';

const Home = () => {
  return (
    <div className='max-w-7xl w-full h-full flex flex-col items-center'>
        <div className='w-full flex flex-col items-center mt-4'>
            <Logo/>
            <h1 className='text-[hsl(var(--text-color))] '>
                Find something to do.
            </h1>
        </div>
        <div className='w-full grow flex flex-col items-center gap-16 m-16'>
            <div className='w-full flex grow justify-around items-center gap-16'>
                <HomeCard path={`/music`} label='Music' icon={<Music size={164}/>}/>
                <HomeCard path={`/sports`} label='Sports' icon={<Trophy size={164}/>}/>
                <HomeCard path={`/film`} label='Film' icon={<Film size={164}/>}/>
            </div>
            <div className='w-full flex grow justify-around items-center gap-16'>
                <HomeCard path={`/arts`} label='Arts' icon={<Drama size={164}/>}/>
                <HomeCard path={`/misc`} label='Misc' icon={<Puzzle size={164}/>}/>
            </div>
            
        </div>
    </div>
  );
};

export default Home;
