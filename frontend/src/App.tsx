import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {lazy, Suspense} from 'react';

const LazyHome = lazy(() => import("./components/Home"));
const LazySearchResults = lazy(() => import("./components/SearchResults"));
const LazyExperienceDetails = lazy(() => import("./components/ExperienceDetails"));
const LazyCheckout = lazy(() => import("./components/Checkout"));
const LazyConfirmation = lazy(() => import("./components/Confirmation"));
const LazyNotFound = lazy(() => import("./components/NotFound"));

function App() {

  return (<>
      <Toaster richColors position="top-right" toastOptions={{style: { fontSize: "1rem", fontWeight: "bold" }}}/>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LazyHome />} />
            <Route path="/search" element={<LazySearchResults />} />
            <Route path="/experience/:id" element={<LazyExperienceDetails />} />
            <Route path="/checkout" element={<LazyCheckout />} />
            <Route path="/confirmation" element={<LazyConfirmation />} />
            <Route path="*" element={<LazyNotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      </>
  )
}

export default App
