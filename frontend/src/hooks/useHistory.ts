import { useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import { deleteHistory } from "../utils/deleteHistory";
import { API_URL } from "../config";
import type { History } from "../utils/types";
import toast from "react-hot-toast";

export function useHistory(uuid: string | undefined) {
    const [history, setHistory] = useState<History[]>([]);
    const [openHistory, setOpenHistory] = useState(false);
    const [openHistoryDelete, setOpenHistoryDelete] = useState<number | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    useEffect(() => {
        if (!uuid) return;
        const fetchHistory = async () => {
            try {
                const response = await authFetch(`${API_URL}/polls/${uuid}/products/suggestion`);
                const data = await response.json().catch(() => null);
                setHistory(data);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Something went wrong";
                toast.error(message);
                console.error("Failed to fetch history", error);
            }
        };
        fetchHistory();
    }, [uuid]);

    const handleToggleHistory = () => setOpenHistory((prev) => !prev);

    const handleDeleteHistory = async (e: React.MouseEvent, historyId: number) => {
        e.stopPropagation();
        if (!uuid) return;
        try {
            await deleteHistory(uuid, historyId);
            toast.success("History deleted successfully!", { duration: 2000 });
            setHistory((prev) => prev.filter((h) => h.id !== historyId));
            setOpenHistoryDelete(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to delete history:", error);
        }
    };

    const handleAddHistoryToIdeas = async (historyId: number) => {
        if (!uuid) return;
        try {
            const response = await authFetch(`${API_URL}/polls/${uuid}/ideas/${historyId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uuid, history_id: historyId }),
            });
            const data = await response.json().catch(() => null);
            if (!response.ok) {
                toast.error(data?.detail || "Error adding history to ideas");
                console.error("Error adding history to ideas", data)
                return;
            }
            toast.success("History saved to Ideas successfully!", { duration: 2000 });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Error adding history to ideas:", error);
        }
    };

    const handleCopyHistory = async (historyId: number, name: string) => {
        if (!uuid) return;

        try {
            await navigator.clipboard.writeText(name);
            setCopiedId(historyId);
            setTimeout(() => setCopiedId(null), 2000);
            toast.success("Text copied to clipboard!", { duration: 2000 });

        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to copy:", error);
        }
    };

    return {
        history,
        openHistory,
        openHistoryDelete,
        setOpenHistoryDelete,
        handleToggleHistory,
        handleDeleteHistory,
        handleAddHistoryToIdeas,
        handleCopyHistory,
        copiedId,
    };
}