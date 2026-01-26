import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Polls from "./pages/Polls"
import PollPage from "./pages/Poll"
import PollAdd from "./pages/PollAdd"
import Profile from "./pages/Profile"
import Search from "./pages/Search"
import Ideas from "./pages/Ideas"


export default function App() {
  return (
    <Router>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-polls" element={<Polls />} />
        <Route path="/:uuid" element={<PollPage />} />
        <Route path="/add-poll" element={<PollAdd />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/:uuid/search" element={<Search />} />
        <Route path="/:uuid/ideas" element={<Ideas />} />
      </Routes>
    </Router>
  )
}


