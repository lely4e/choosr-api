import { useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import { API_URL } from "../config";
import { type Activities } from "../utils/types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useActivities() {
    const [activities, setActivities] = useState<Activities[]>([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // fetch activities
    useEffect(() => {
        const getActivities = async () => {
            try {
                const response = await authFetch(`${API_URL}/activities`);
                const data = await response.json().catch(() => null);
                setActivities(data);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Something went wrong";
                toast.error(message);
                console.error("Failed to fetch activities", error);
            }
        };
        getActivities();
    }, []);

    const handleAddSharedPoll = async (uuid: string) => {
        if (!uuid) return;
        try {
            const response = await authFetch(`${API_URL}/activities`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uuid: uuid,
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                toast.error(data?.detail || "Error to add poll");
                console.error("Error to add shared poll:", data);
                return;
            }

            const updated = await authFetch(`${API_URL}/activities`);
            setActivities(await updated.json());

            console.log("Shared Poll added successfully:", data);
            toast.success("Shared Poll added successfully!", {
                duration: 2000,
            });

            setTimeout(() => {
                navigate("/my-polls");
            }, 1000);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Error to add poll:", error);
        }
    };

    const handleDeleteSharedPoll = async (uuid: string) => {
        if (!uuid) return;
        try {
            const response = await authFetch(`${API_URL}/activities/${uuid}`, {
                method: "DELETE",
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                toast.error(data.error || "Failed to delete shared poll");
                console.error("Error to delete shared poll:", data);
                return;
            }

            toast.success("Shared Poll deleted successfully!", {
                duration: 2000,
            });
            setOpen(false);

            setTimeout(() => {
                navigate("/my-polls");
            }, 2000);
            console.log("Shared Poll deleted");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to delete shared poll:", error);
        }
    };

    return {
        activities,
        open,
        setOpen,
        handleAddSharedPoll,
        handleDeleteSharedPoll,
    };
}