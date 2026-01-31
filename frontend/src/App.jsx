import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import AuctionList from "./components/AuctionList";
import AuctionDetail from "./components/AuctionDetail";
import Login from "./components/Login";
import RequireAuth from "./components/RequireAuth";
import Register from "./components/Register";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* OPEN TO EVERYONE (Guests included) */}
        <Route path="/" element={<AuctionList />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
