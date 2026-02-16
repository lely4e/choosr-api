import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type UserContext, type User } from "../utils/types";


// create context with default value
const UserContext = createContext<UserContext | undefined>(undefined);

// provider component
export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // update user
    const updateUser = (updateUser: User) => {
        setUser(updateUser);
    }

    // check auth on mount
    useEffect(() => {

        const token = sessionStorage.getItem("access_token");

        // check if token exists in sessionStorage
        if (!token) {
            setLoading(false);
        } else {
            verifyToken(token)
        }

    }, []);

    // verify token
    const verifyToken = async (token: string) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData); // Token valid, set user
            } else {
                // Token invalid/expired
                sessionStorage.removeItem("access_token");
                setUser(null);
            }
        } catch (error) {
            console.error("Token verification failed:", error);
            sessionStorage.removeItem("access_token");
            setUser(null);
        } finally {
            setLoading(false); // Always stop loading
        }
    };
    
    // login
    const login = (token: string, userData?: User) => {
        sessionStorage.setItem("access_token", token);
        setUser(userData || null)
    };

    // logout
    const logout = () => {
        sessionStorage.removeItem("access_token");
        setUser(null);
        window.location.href = "/login"
    }

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        loading
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
}