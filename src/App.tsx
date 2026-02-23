import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/dashboard";
import Checkins from "./pages/checkin/checkins";
import CreateCheckIn from "./pages/checkin/create";
// Бусад хуудсуудаа энд импортлоорой (Checkouts, Items г.м)

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
                  <Route path="/checkins" element={<Checkins />} />
                  <Route path="/checkins/create" element={<CreateCheckIn />} />
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
