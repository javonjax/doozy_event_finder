import { Categories } from "@/schemas/schemas";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import Footer from "@/components/Footer/Footer";
import Home from "@/components/Home/Home";
import NavBar from "@/components/NavBar/NavBar";
import NotFound from "@/components/NotFound/NotFound";
import { LocationProvider } from "@/components/Providers/LocationContext";


const App = () => {
  return (
    <>
      <BrowserRouter>
        <LocationProvider>
        <NavBar/>
        <main className='grow flex flex-col items-center'>
          <Toaster/>
          <Routes>
            <Route
              path='/'
              element={<Home/>}
            />
            {Categories.map((cat: string): React.JSX.Element => (
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
        </LocationProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
