import { Toaster } from "sonner";
import Home from "./components/Home"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchResults from "./components/SearchResults";
import ExperienceDetails from "./components/ExperienceDetails";
import Checkout from "./components/Checkout";
import Confirmation from "./components/Confirmation";
import NotFound from "./components/NotFound";
function App() {

  return (<>
      <Toaster richColors position="top-right" toastOptions={{style: { fontSize: "1rem", fontWeight: "bold" }}}/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/experience/:id" element={<ExperienceDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </>
  )
}

export default App
