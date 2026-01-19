import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header>
            <div className="menu">
                <div className="logo">
                <Link to="/">
                <img src="../src/assets/logo_orange.svg" alt="logo" width={120}/>
                </Link>
                </div>
                {/* <a href="/">HOME</a> */}
                <div className="menu-text">
                <a href="/my-polls">Events</a>
                <a href="/search">Search</a>
                <a href="/ideas">Gift Ideas</a>
                <a href="/saved">Saved</a>
                {/* <a href="">PROFILE</a> */}
                <a href="/login">Sign in</a>
                {/* <a href="/signup">Sign up</a> */}
                <Link to="/profile">
                <img src="../src/assets/profile.svg" alt="profile" width={40}/>
                </Link>
                </div>
            </div>
        </header>
    )
}