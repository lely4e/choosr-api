import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { UserProvider } from './context/UserContext';
import Navbar from "./components/Navbar"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Polls from "./pages/Polls"
import PollPage from "./pages/Poll"
import PollAdd from "./pages/PollAdd"
import Profile from "./pages/Profile"
import Search from "./components/Search"
import Ideas from "./components/Ideas"
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer"


export default function App() {
  return (
    <>
    <Toaster position="top-center" />
    <UserProvider>
    <Router>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-polls" element={<ProtectedRoute><Polls /></ProtectedRoute>} />
        <Route path="/polls/:uuid" element={<ProtectedRoute><PollPage /></ProtectedRoute>} />
        <Route path="/add-poll" element={<ProtectedRoute><PollAdd /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/polls/:uuid/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/polls/:uuid/ideas" element={<ProtectedRoute><Ideas title={""} budget={0} /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </Router>
    </UserProvider>
    </>
  )
}


