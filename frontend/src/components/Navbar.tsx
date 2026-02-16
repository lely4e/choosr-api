import { Link } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useEffect, useState } from "react";
import type { User } from "../utils/types";
import { Plus, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await authFetch("http://127.0.0.1:8000/me");
        const data = await response.json();

        if (!response.ok) {
          alert(data.detail || "Unauthorized");
          return;
        }

        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, []);

  // NOT LOGGED IN
  if (!user) {
    return (
      <header className="w-full">
        <div className="flex justify-between items-center
                        px-6 py-4
                        max-w-300 mx-auto">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src="../src/assets/logo_orange.svg"
              alt="logo"
              className="w-30"
            />
          </Link>

          {/* SIGN IN */}
          <Link
            to="/login"
            className="text-[#737791] font-medium
                       hover:text-[#F25E0D]
                       transition"
          >
            Sign in
          </Link>
        </div>
      </header>
    );
  }

  // LOGGED IN
  return (
    <header className="w-full">
      <div className="flex justify-between items-center
                      px-4 py-4
                      max-w-300 mx-auto">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src="../src/assets/logo_orange.svg"
            alt="logo"
            className="w-30"
          />
        </Link>

        {/* RIGHT MENU */}
        <div className="flex items-center gap-8">

          <Link
            to="/my-polls"
            className="text-[#737791] font-medium
                       hover:text-[#F25E0D]
                       transition"
          >
            My Polls
          </Link>

          <Link
            to="/add-poll"
            className="flex items-center gap-2
                       px-4 py-2 rounded-full
                       bg-linear-to-r from-[#FF6A00] to-pink-500
                       text-white font-medium
                       transition hover:opacity-90"
          >
            <Plus size={16} strokeWidth={2.5} color="white"/>
            Create Poll
          </Link>

          <div className="flex items-center gap-2 cursor-pointer group">
            <Link to="/profile">
              <img
                src="../src/assets/profile.svg"
                alt="Profile"
                className="w-8 h-8 rounded-full
                           border border-gray-300
                           group-hover:border-[#F25E0D]
                           transition"
              />
            </Link>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="text-[#737791] group-hover:text-[#F25E0D] transition"
            />
          </div>

        </div>
      </div>
    </header>
  );
}
