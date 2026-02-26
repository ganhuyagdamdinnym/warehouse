import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/dashboard";
import Checkins from "./pages/checkin/checkins";
import CreateCheckIn from "./pages/checkin/create";
import Checkout from "./pages/checkout/checkouts";
import CreateCheckOut from "./pages/checkout/create";
import Adjustment from "./pages/adjustment/adjustment";
import CreateAdjustment from "./pages/adjustment/create";
import Transfer from "./pages/transfer/transfer";
import CreateTransfer from "./pages/transfer/create";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen print:bg-white">
        <div className="md:flex md:flex-col">
          <div className="md:h-screen md:flex md:flex-col">
            <Header />
            <div className="md:flex md:grow md:items-stretch overflow-hidden">
              <Sidebar />

              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/checkin" element={<Checkins />} />
                  <Route path="/checkin/create" element={<CreateCheckIn />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/checkout/create" element={<CreateCheckOut />} />
                  <Route path="/adjustment" element={<Adjustment />} />
                  <Route
                    path="/adjustment/create"
                    element={<CreateAdjustment />}
                  />
                  <Route path="/transfer" element={<Transfer />} />
                  <Route path="/transfer/create" element={<CreateTransfer />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
