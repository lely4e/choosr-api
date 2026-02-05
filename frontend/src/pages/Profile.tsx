import { useEffect, useState } from "react";
import type { User } from "../utils/types";
import { authFetch } from "../utils/auth";
import { Link } from "react-router-dom";
import { updateUsername } from "../utils/updateUser";
import { Edit } from "lucide-react"


export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [newUsername, setNewUsername] = useState<string>("");

  const [isEditing, setIsEditing] = useState<boolean>(false);


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

  const startEditing = () => {
    setIsEditing(true);
    setNewUsername(user.username);

  };

  const cancelEditing = () => {
    setIsEditing(false);
  }

  const handleUpdateUser = async () => {
    try {
      await updateUsername(newUsername);
      setUser({ ...user, username: newUsername });
      setNewUsername(newUsername);
      console.log("User updated:", newUsername);
    } catch (error) {
      console.error("Failed to update username:", error);
    }
  };

  return (
    <>
      <div className="wrap-profile">
        <div className="product-container">
          <div className="profile-card">
            <div className="photo-change">
              <img src="../src/assets/profile.svg" alt="profile-foto" width={140} />
              {/* <p className="change-photo">✏️ Change photo</p> */}
            </div>
            <div>
            </div>
            <div className="username-input">



              {!isEditing ? (
                <>
                {/* VIEW MODE*/}
                <div className="user-edit">
                  <div className="profile-text">
                    <strong>Username:</strong> {user.username}
                    <a onClick={startEditing}><Edit size={20} strokeWidth={1.5} style={{ color: "#737791" }} /></a>
                  </div>
                  
                  </div>
                </>
              ) : (
                <>
                {/* EDIT MODE*/}
                  <label htmlFor="username">
                    <strong>New username:</strong>
                  </label>
                  <input
                    className="field-username"
                    type="text"
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />

                  <div className="edit-actions">
                    <button
                      className="apply-button"
                      onClick={async () => {
                        await handleUpdateUser();
                        setIsEditing(false);
                      }}
                    >
                      Apply
                    </button>

                    <button
                      className="cancel-button"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}




              <div className="profile-text"><strong>Email address:</strong> {user.email}</div>



            </div>
          </div>
        </div>
      </div>
    </>
  );
}
