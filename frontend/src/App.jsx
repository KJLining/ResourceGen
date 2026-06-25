import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/landingpage"

import BookLayout from "./modules/bookselling/layout/booklayout"
import BookDashboard from "./modules/bookselling/pages/bookdashboard"
import ProfPage from "./modules/bookselling/pages/profpage"
import PublisherPage from "./modules/bookselling/pages/publisherpage"
import Inventory from "./modules/bookselling/pages/inventory"
import ProfDetailsPage from "./modules/bookselling/components/view/profdetailspage"
import PublisherDetailPage from "./modules/bookselling/components/view/publisherdetailpage"
import BookDetailPage from "./modules/bookselling/components/view/bookdetailpage"
import BuyBook from "./modules/bookselling/pages/buybook"
import Reports from "./modules/bookselling/pages/reports"
import Remittances from "./modules/bookselling/pages/remittances"
import Settings from "./modules/bookselling/pages/settings"

import PrintingLayout from "./modules/printingservices/layout/printinglayout"
import PrintingDashboard from "./modules/printingservices/pages/printingdashboard"
import AllRequests from "./modules/printingservices/pages/allrequests"
import ReceivedRequests from "./modules/printingservices/pages/receivedrequests"
import ReadyForPickup from "./modules/printingservices/pages/readyforpickup"
import ClaimedRequests from "./modules/printingservices/pages/claimedrequests"
import CancelledRequests from "./modules/printingservices/pages/cancelledrequests"
import PrintingReports from "./modules/printingservices/pages/reports"
import PrintingLists from "./modules/printingservices/pages/printinglists"
import ForBinding from "./modules/printingservices/pages/forbinding"
import ClaimingList from "./modules/printingservices/pages/claiminglist"

import ConcessionaireLayout from "./modules/concessionaires/layout/concessionairelayout"
import ConcessionaireDashboard from "./modules/concessionaires/pages/concessionairedashboard"
import ConcessionaireListPage from "./modules/concessionaires/pages/concessionairelist"
import ConcessionaireDetailPage from "./modules/concessionaires/pages/concessionairedetailpage"
import BillsPage from "./modules/concessionaires/pages/billspage"
import DocumentsPage from "./modules/concessionaires/pages/documentspage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* ── Book Selling ── */}
        <Route element={<BookLayout />}>
          <Route path="/bookdashboard" element={<BookDashboard />} />
          <Route path="/profpage" element={<ProfPage />} />
          <Route path="/publisherpage" element={<PublisherPage />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/admin/professors/:id" element={<ProfDetailsPage />} />
          <Route path="/publisherdetail/:id" element={<PublisherDetailPage />} />
          <Route path="/bookdetail/:id" element={<BookDetailPage />} />
          <Route path="/buybook" element={<BuyBook />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/remittances" element={<Remittances />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* ── Printing Services ── */}
        <Route element={<PrintingLayout />}>
          <Route path="/printingdashboard" element={<PrintingDashboard />} />
          <Route path="/allrequests" element={<AllRequests />} />
          <Route path="/receivedrequests" element={<ReceivedRequests />} />
          <Route path="/forbinding" element={<ForBinding />} />
          <Route path="/readyforpickup" element={<ReadyForPickup />} />
          <Route path="/claimedrequests" element={<ClaimedRequests />} />
          <Route path="/cancelledrequests" element={<CancelledRequests />} />
          <Route path="/printingreports" element={<PrintingReports />} />
          <Route path="/printinglists" element={<PrintingLists />} />
          <Route path="/claiminglist" element={<ClaimingList />} />
        </Route>

        {/* ── Concessionaires ── */}
        <Route element={<ConcessionaireLayout />}>
          <Route path="/concessionaires" element={<ConcessionaireDashboard />} />
          <Route path="/concessionaires/list" element={<ConcessionaireListPage />} />
          <Route path="/concessionaires/list/:id" element={<ConcessionaireDetailPage />} />
          <Route path="/concessionaires/bills" element={<BillsPage />} />
          <Route path="/concessionaires/documents" element={<DocumentsPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App