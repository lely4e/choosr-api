import { useState } from "react";
import { Link } from "react-router-dom";
import { updateUsername } from "../utils/updateUser";
import { Edit, LogOut } from "lucide-react";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";

export default function Profile() {
  // user from Context
  const { user, updateUser, logout } = useUser();

  const [newUsername, setNewUsername] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

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
  };

  const handleUpdateUser = async () => {
    try {
      await updateUsername(newUsername);
      updateUser({ ...user, username: newUsername });
      setIsEditing(false);
      console.log("User updated:", newUsername);
      toast.success("User updated successfully!", {
        duration: 2000,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Failed to update username: ${error.message}`);
        console.error(`Failed to update username: ${error.message}`);
      } else {
        toast.error("Failed to update username!");
        console.error("Failed to update username!", error);
      }
    }
  };

  return (
    <>
      <div className="grid justify-center mx-auto">
        <div className="grid gap-6 w-full max-w-200 my-10 mx-auto grid-cols-1">
          <div
            className="
    w-full
    flex
    justify-center
    p-6
    rounded-[30px]
    bg-white/50
    backdrop-blur-[10px]
    shadow-[0_10px_25px_rgba(0,0,0,0.157),0_4px_10px_rgba(0,0,0,0.04)]
    transition-transform duration-250
    hover:-translate-y-1
    hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]
  "
          >
            <div className="grid items-center content-center">
              <img
                src="../src/assets/profile.svg"
                alt="profile-foto"
                width={140}
              />
              {/* <p className="change-photo">✏️ Change photo</p> */}
            </div>
            <div></div>
            <div className="flex flex-col justify-center pl-10 gap-2.5">
              {!isEditing ? (
                <>
                  {/* View Mode */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-left gap-2.5">
                      <strong>Username:</strong> {user.username}
                    </div>
                    <a
                      onClick={startEditing}
                      className="cursor-pointer color-[#737791] hover:text-[#F25E0D]"
                    >
                      <Edit size={20} strokeWidth={1.5} />
                    </a>
                  </div>
                </>
              ) : (
                <>
                  {/* Edit Mode */}
                  <label htmlFor="username" className="text-left">
                    <strong>New username:</strong>
                  </label>
                  <input
                    className="rounded-xl border border-[#3bb5f6] bg-transparent text-[#737791] pl-2.5 px-6 py-2 text-base w-75"
                    type="text"
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />

                  <div className="flex justify-between gap-2.5 ">
                    <button
                      className="flex-1 border  rounded-xl px-6 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>

                    <button
                      // className="h-8.75 flex items-center flex-1 text-base justify-center bg-[#0096FF] text-white font-normal rounded-xl cursor-pointer"
                      className="flex-1  bg-[#0096FF]  text-white rounded-xl px-6 py-2  hover:bg-[#0072c4]  hover:text-white transition-colors"
                      onClick={async () => {
                        await handleUpdateUser();
                        setIsEditing(false);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </>
              )}

              <div className="flex items-center text-left gap-2.5">
                <strong>Email address:</strong> {user.email}
              </div>

              <button
                onClick={logout}
                className="cursor-pointer pt-4 hover:text-[#0072c4]"
              >
                <LogOut size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
