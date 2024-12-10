import { categories } from "@/schemas/schemas";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import NotFound from "@/components/NotFound/NotFound";
import Home from "@/components/Home/Home";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <main className='grow flex flex-col items-center'>
          <Routes>
            <Route
              path='/'
              element={<Home/>}
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
        <Footer/>
      </BrowserRouter>
    </>
  );
};

export default App;
