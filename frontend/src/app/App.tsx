import { Categories } from "@/schemas/schemas";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Footer from "@/components/Footer/Footer";
import Home from "@/components/Home/Home";
import NavBar from "@/components/NavBar/NavBar";
import NotFound from "@/components/NotFound/NotFound";
import CategoryLanding from "@/components/Category/CategoryLanding";
import { LocationProvider } from "@/components/Providers/LocationContext";


const App = () => {
  const queryClient: QueryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
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
                  element={<CategoryLanding path={cat}/>}
                />
              ))}
              <Route
                path='/popular'
                element={<CategoryLanding path='popular'/>}/>
              <Route
                path='/local'
                element={<CategoryLanding path='local'/>}/>
              <Route
                path='*'
                element={<NotFound/>}/>
            </Routes>
          </main>
          <Footer/>
          </LocationProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
};

export default App;
