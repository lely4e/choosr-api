import { Link } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useEffect, useState } from "react";
import type { User } from "../utils/types";
import { Plus, ChevronDown } from "lucide-react"


export default function Navbar() {

  const [user, setUser] = useState<User | null>(null);

  // fetch user on mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await authFetch("http://127.0.0.1:8000/me");
        const data = await response.json();

        if (!response.ok) {
          alert(data.detail || "Unauthorized");
          console.error("Unauthorized:", data);
          return;
        }

        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, []);

  if (!user) {
    return (
      <header>
        <div className="menu">
          <div className="logo">
            <Link to="/">
              <img src="../src/assets/logo_orange.svg" alt="logo" width={120} />
            </Link>
          </div>
          <div className="menu-text">
            <a href="/login">Sign in</a>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header>
      <div className="menu">
        <div className="logo">
          <Link to="/">
            <img src="../src/assets/logo_orange.svg" alt="logo" width={120} />
          </Link>
        </div>
        <div className="menu-text">
          <a href="/my-polls">My Polls</a>

          <a href="/add-poll" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={16} strokeWidth={2.5} style={{ marginRight: "6px" }} />
            Create Poll
            </a>
            
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Link to="/profile">
              <img src="../src/assets/profile.svg" alt="Profile" style={{ width: 32, height: 32, borderRadius: "50%" }} />
            </Link>
            <ChevronDown size={16} strokeWidth={2} />
          </div>
        </div>
      </div>
    </header>
  )
}