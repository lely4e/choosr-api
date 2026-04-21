import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import logoImg from "../assets/logo_orange.svg"
import { PlusIcon, SignInIcon } from "@phosphor-icons/react";

export default function Navbar() {
  const { user, avatarUrl } = useUser();

  // NOT LOGGED IN
  if (!user) {
    return (
      <header className="w-full">
        <div className="flex justify-between items-center
                        px-4
                        max-w-300 mx-auto">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src={logoImg}
              alt="logo"
              className="w-26"
            />
          </Link>

          {/* SIGN IN */}
          <Link
            to="/login"
            className="flex items-center gap-2
                       px-4 py-2 rounded-full
                       border border-[#FF6A00]
                       text-[#FF6A00] text-[14px] tracking-[0.3px]
                       transition hover:bg-[#FF6A00] hover:text-white font-medium"
          >
            Sign in
            <SignInIcon size={16} weight="fill" />
          </Link>
          
        </div>
      </header>
    );
  }

  // LOGGED IN
  return (
    <header className="w-full">
      <div className="flex justify-between items-center
                      px-4 
                      max-w-300 mx-auto">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src={logoImg}
            alt="logo"
            className="w-26"
          />
        </Link>

        {/* RIGHT MENU */}
        <div className="flex items-center gap-8">

          <Link
            to="/my-polls"
            className="text-[#737791] text-[14px] tracking-[0.3px]
                       hover:text-[#F25E0D]
                       transition"
          >
          Polls
          </Link>

          <Link
            to="/my-ideas"
            className="text-[#737791] text-[14px] tracking-[0.3px]
                       hover:text-[#F25E0D]
                       transition"
          >
            Ideas
          </Link>

          <Link
            to="/add-poll"
            className="flex items-center gap-2
                       px-4 py-2 rounded-full
                       bg-linear-to-r from-[#FF6A00] to-pink-500
                       text-white text-[14px] tracking-[0.3px]
                       transition hover:opacity-90"
          >
            <PlusIcon size={16} strokeWidth={2.5} color="white" />
            Create Poll
          </Link>

          <div className="flex items-center gap-2 cursor-pointer group">
            <Link to="/profile">
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
