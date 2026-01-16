
import { useEffect, useState } from "react";
import type { User } from "../utils/types";
import { authFetch } from "../utils/auth";
import { Link } from "react-router-dom";


export default function Profile() {
    const [user, setUser] = useState<User | null>(null);

    // fetch user on mount
    useEffect(() => {
        const getUser = async () => {

            try {
                const response = await authFetch(`http://127.0.0.1:8000/me`);
                const data = await response.json();

                if (!response.ok) {
                    alert(data.detail || "Unauthorized");
                    console.error("Unauthorized:", data);
                    return;
                }

                setUser(data);
                console.log("User fetched:", data);
            } catch (error) {
                // alert("Server is unreachable");
                console.error(error);
            }
        };

        getUser();
    }, []);

    if (!user) {
        return (
        <div>
            <p>You need to be logged in.</p>
            <Link to="/login">log in</Link>
        </div>)
    };

    return (
        <div>
            <h1>Profile</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <button>Update</button>
            <button>Delete</button>
        </div>
    )
};


