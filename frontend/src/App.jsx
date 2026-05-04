import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/landingpage"

import BookLayout from "./modules/bookselling/layout/booklayout"
import BookDashboard from "./modules/bookselling/pages/bookdashboard"
import ProfPage from "./modules/bookselling/pages/profpage"
function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route element={<BookLayout />}>
            <Route path="/bookdashboard" element={<BookDashboard />} />
            <Route path="/profpage" element={<ProfPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
