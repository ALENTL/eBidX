import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import AuctionList from "./components/AuctionList";
import AuctionDetail from "./components/AuctionDetail";
import Login from "./components/Login";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* PUBLIC ROUTE (Anyone can see) */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES (Must be logged in) */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <AuctionList />
            </RequireAuth>
          }
        />

        <Route
          path="/auction/:id"
          element={
            <RequireAuth>
              <AuctionDetail />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
