import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import AuctionList from "./components/AuctionList";
import AuctionDetail from "./components/AuctionDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateAuction from "./components/CreateAuction";
import WatchList from "./components/WatchList";
import Checkout from "./pages/Checkout";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<AuctionList />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateAuction />} />
        <Route path="/watchlist" element={<WatchList />} />
        <Route
          path="/checkout/:id"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
