import { categories } from "@/schemas/schemas";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "@/components/NavBar/NavBar";
import NotFound from "@/components/NotFound/NotFound";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <main className='grow flex flex-col items-center'>
          <Routes>
            <Route
              path='/'
              element={<div className='w-full max-w-7xl border-solid border-2'>Hello world</div>
              }
            />
            {categories.map((cat: string): React.JSX.Element => (
              <Route
                key={cat}
                path={`/${cat.toLowerCase()}`}
                element={<div>Hello from {cat.toLowerCase()}</div>}
              />
            ))}
            <Route
              path='*'
              element={<NotFound/>}
            />
          </Routes>
        </main>
        <footer>howdy</footer>
      </BrowserRouter>
    </>
  );
};

export default App;
