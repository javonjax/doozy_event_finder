import { categories } from '@/components/NavBar/NavBar';
import NavBar from "@/components/NavBar/NavBar";

const App = () => {
  return (
    <>
      <NavBar/>
      <div className='bg-slate-900'>
        <div className='h-screen max-w-7xl mx-auto bg-slate-900'>
          {categories.map((cat)=> {
            return(
              <div>{cat}</div>
            )
          })}
          <div>hello</div>
          <div>hello</div>
          <div>hello</div>
        </div>
      </div>
    </>
  );
};

export default App;
