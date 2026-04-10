import { useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import { API_URL } from "../config";
import toast from "react-hot-toast";
import { type Poll } from "../utils/types";
import { deletePoll } from "../utils/deletePoll";
import { updatePoll } from "../utils/updatePoll";
import { useNavigate } from "react-router-dom";

export function usePoll(uuid: string | undefined) {
    const [poll, setPoll] = useState<Poll | null>(null);
    const [, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [editedTitle, setEditedTitle] = useState<string>("");
    const [editedBudget, setEditedBudget] = useState<number>(0);
    const [editedDescription, setEditedDescription] = useState<string>("");
    const [editedDeadline, setEditedDeadline] = useState<string>("");
    const [editedManuallyClosed, setEditedManuallyClosed] =
        useState<boolean>(false);
    const [copied, setCopied] = useState(false);
    const [openPoll, setOpenPoll] = useState(false);
    const [share, setShare] = useState(false);
    const [showPollCard, setShowPollCard] = useState(true);
    const [openCard, setOpenCard] = useState(false);

    const navigate = useNavigate();

    // fetch poll
    useEffect(() => {
        const getPoll = async () => {
            if (!uuid) return;
            try {
                const response = await authFetch(`${API_URL}/polls/${uuid}`);
                const data = await response.json();
                if (!response.ok) {
                    alert(data.detail || "Unauthorized");
                    console.error("Unauthorized:", data);
                    return;
                }
                setPoll(data);
                console.log("Polls fetched:", data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(`Failed to fetch products: ${error.message}`);
                    console.error(`Failed to fetch products: ${error.message}`);
                } else {
                    toast.error("Failed to fetch products!");
                    console.error("Failed to fetch products!", error);
                }
            }
        };
        getPoll();
    }, [uuid]);

    // delete poll
    const handleDeletePoll = async (e: React.MouseEvent, uuid: string) => {
        e.stopPropagation();
        try {
            await deletePoll(uuid);
            toast.success("Poll deleted successfully!", {
                duration: 2000,
            });
            setOpen(false);

            setTimeout(() => {
                navigate("/my-polls");
            }, 2000);
            console.log("Poll deleted");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Failed to delete poll: ${error.message}`);
                console.error(`Failed to delete poll: ${error.message}`);
            } else {
                toast.error("Failed to delete poll!");
                console.error("Failed to delete poll!", error);
            }
        }
    };

    // update poll
    const startEditing = () => {
        if (!poll) return;
        setIsEditing(true);
        setEditedTitle(poll.title);
        setEditedBudget(poll.budget);
        setEditedDescription(poll.description || "");
        setEditedDeadline(poll.deadline || "");
        setEditedManuallyClosed(poll.manually_closed);
    };

    const cancelEditing = () => setIsEditing(false);

    const handleApplyUpdate = async () => {
        if (!uuid) return;

        if (editedTitle.trim().length > 100) {
            toast("Title is too long", {
                icon: "⚠️",
            });
            return;
        }
        setIsEditing(false);

        try {
            const updatedPoll = await updatePoll(
                uuid!,
                editedTitle,
                editedBudget,
                editedDescription || undefined,
                editedDeadline || undefined,
                editedManuallyClosed,
            );

            console.log("Server response:", updatedPoll);
            console.log("Deadline in response:", updatedPoll.deadline);

            setPoll(updatedPoll);
            setIsEditing(false);
            toast.success("Poll updated successfully!", {
                duration: 2000,
            });
            console.log("Poll updated", poll);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Failed to update poll: ${error.message}`);
                console.error(`Failed to update poll: ${error.message}`);
            } else {
                toast.error("Failed to update poll!");
                console.error("Failed to update poll!", error);
            }
        }
    };
    const handleCopy = async () => {
        if (!uuid) return;
        const linkToCopy = `${window.location.origin}/polls/${uuid}`;

        try {
            await navigator.clipboard.writeText(linkToCopy);
            setCopied(true);
            toast.success("Link copied to clipboard!", { duration: 2000 });
            setTimeout(() => setCopied(false), 2000);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Failed to copy: ${error.message}`);
                console.error(`Failed to copy: ${error.message}`);
            } else {
                toast.error("Failed to copy!");
                console.error("Failed to copy!", error);
            }
        }
    };

    return {
        poll,
        isEditing,
        editedTitle,
        editedBudget,
        editedManuallyClosed,
        editedDescription,
        editedDeadline,
        setEditedTitle,
        setEditedBudget,
        setEditedDescription,
        setEditedDeadline,
        setEditedManuallyClosed,
        startEditing,
        cancelEditing,
        handleApplyUpdate,
        handleDeletePoll,
        handleCopy,
        copied,
        openPoll,
        setOpenPoll,
        share,
        setShare,
        showPollCard,
        setShowPollCard,
        openCard,
        setOpenCard,
    };
}
