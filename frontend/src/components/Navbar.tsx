import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header>
            <div className="menu">
                <div className="logo">
                <Link to="/">
                <img src="../src/assets/logo.svg" alt="logo" width={120}/>
                </Link>
                </div>
                {/* <a href="/">HOME</a> */}
                <div className="menu-text">
                <a href="/my-polls">POLLS</a>
                <a href="">SEARCH</a>
                <a href="">GIFT IDEAS</a>
                <a href="">SAVED</a>
                {/* <a href="">PROFILE</a> */}
                <a href="/login">LOG IN</a>
                <a href="/signup">SIGN UP</a>
                <Link to="/profile">
                <img src="../src/assets/profile.svg" alt="profile" width={40}/>
                </Link>
                </div>
            </div>
        </header>
    )
}