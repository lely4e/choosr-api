
import { useEffect, useState } from "react";
import type { User } from "../utils/types";
import { authFetch } from "../utils/auth";
import { Link } from "react-router-dom";
import { updateUsername } from "../utils/updateUser";


export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [newUsername, setNewUsername] = useState<string>("");

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
                setNewUsername(data.username);
                console.log("User updated:", data);
            } catch (error) {
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
            </div>
        );
    }

    const handleUpdateUser = async () => {
        try {
            await updateUsername(newUsername);
            setUser({ ...user, username: newUsername });
        } catch (error) {
            console.error("Failed to update username:", error);
        }

    }

    return (
        <div className="wrap-product">
            <div className="product-container">
                <div className="card">
                    <h1>Profile Information</h1>
                    <div className="profile-text">Username: {user.username}</div>
                    <div className="profile-text">Email: {user.email}</div>

<div className="username-input">
                    <label htmlFor="username">
                        New Username
                        <input
                            type="text"
                            id="username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}

                        />
                        <button onClick={handleUpdateUser}>Update</button>
                    </label>
</div>
                    <button>Delete</button>
                </div>
            </div>
            <div>saved products</div>
            <div>saved ideas</div>
        </div>
    )
};


