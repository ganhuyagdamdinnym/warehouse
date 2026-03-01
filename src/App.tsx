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
import Items from "./pages/items/items";
import Contacts from "./pages/contacts/contacts";
// import Items from "./pages/items/create";
import CreateItem from "./pages/items/create";
import ContactPage from "./pages/contacts/contact";
import CreateContact from "./pages/contacts/create";
import Categories from "./pages/categorie/categories";
import CreateCategorie from "./pages/categorie/create";
import Category from "./pages/categorie/category";
import Units from "./pages/unit/units";
import Warehouses from "./pages/warehouse/warehouses";
import Warehouse from "./pages/warehouse/warehouse";
import CreateWarehouse from "./pages/warehouse/create";
import Users from "./pages/user/users";
import User from "./pages/user/user";

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
                  <Route path="/items/create" element={<CreateItem />} />
                  <Route path="/items" element={<Items />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/contacts/:id/edit" element={<ContactPage />} />
                  <Route path="/contacts/create" element={<CreateContact />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/categories/:id/edit" element={<Category />} />
                  <Route
                    path="/categories/create"
                    element={<CreateCategorie />}
                  />
                  <Route path="/units" element={<Units />} />
                  <Route path="/warehouses" element={<Warehouses />} />
                  <Route path="/warehouses/:id/edit" element={<Warehouse />} />
                  <Route
                    path="/warehouses/create"
                    element={<CreateWarehouse />}
                  />
                  <Route path="/users" element={<Users />} />
                  <Route path="/users/:id/edit" element={<User />} />
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
