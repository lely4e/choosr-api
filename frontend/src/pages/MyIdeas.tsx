import React, { useEffect, useState } from "react";
import type { MyIdeas } from "../utils/types";
import { authFetch } from "../utils/auth";
import { Check, Copy, EditIcon, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import CreateCard from "../components/CreateCard";
import { deleteIdea } from "../utils/deleteIdea";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { updateIdea } from "../utils/updateIdea";
import { colors } from "../utils/colors";

const MyIdeasPage: React.FC = () => {
    const [ideas, setIdeas] = useState<MyIdeas[]>([]);
    const [search, setSearch] = useState<string>("");
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedTitle, setEditedTitle] = useState<string>("");
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getIdeas = async () => {
            try {
                const params = new URLSearchParams();
                if (search) params.append("q", search);

                const response = await authFetch(`${API_URL}/ideas?${params.toString()}`);
                const data = await response.json();
                if (!response.ok) {
                    toast.error(data.detail || "Unauthorized");
                    return;
                }
                setIdeas(data);
                console.log("Ideas:", data)
            } catch (error: unknown) {
                toast.error(error instanceof Error ? `Failed to fetch ideas: ${error.message}` : "Failed to fetch ideas!");
            }
        };
        getIdeas();
    }, [search]);

    const handleDeleteIdea = async (e: React.MouseEvent, ideaId: number) => {
        e.stopPropagation();
        try {
            await deleteIdea(ideaId);
            toast.success("Idea deleted successfully!", { duration: 2000 });
            setDeleteId(null);
            setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
            setTimeout(() => navigate("/my-ideas"), 2000);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? `Failed to delete idea: ${error.message}` : "Failed to delete idea!");
        }
    };

    const handleApplyUpdate = async (e: React.MouseEvent, ideaId: number) => {
        e.stopPropagation();
        try {
            await updateIdea(ideaId, editedTitle);
            setIdeas((prev) =>
                prev.map((i) => i.id === ideaId ? { ...i, title: { ...i.title, name: editedTitle } } : i)
            );
            setEditingId(null);
            toast.success("Idea updated successfully!", { duration: 2000 });
        } catch (error: unknown) {
            toast.error(error instanceof Error ? `Failed to update idea: ${error.message}` : "Failed to update idea!");
        }
    };

    const handleChooseCategory = async (category: string) => {
        setSearch(category);
    }

    const handleCopyIdea = async (ideaId: number, name: string) => {

        try {
            await navigator.clipboard.writeText(name);
            setCopiedId(ideaId);
            setTimeout(() => setCopiedId(null), 2000);
            toast.success("Text copied to clipboard!", { duration: 2000 });

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

    return (
        <>
            <div className="flex justify-between items-center mr-5 text-center">
                <div className="flex flex-col items-center mx-auto">
                    <h1 className="px-5 text-[1.5em] leading-[1.1] font-black mb-2 mt-16">
                        Ideas
                    </h1>
                    <span className="m-2 text-[#737791] font-serif italic">
                        Manage your saved Ideas.
                    </span>

                    {search &&
                        <div className="">
                            <span className="flex items-center text-[10px] font-medium text-gray-700 cursor-pointer ">
                                <span
                                    key={search}
                                    className={`inline-flex px-2.5 py-1 tracking-[0.5px] rounded-full border mt-2 items-center
                                                        ${colors.find((color) => color.name === search.toLowerCase())?.backgroundColor ?? "bg-gray-200 border-gray-400"} 
                                                        ${search.toLowerCase() === search.toLowerCase() ? "ring-2 ring-orange-400 border-none" : ""}`}
                                >
                                    {search}
                                    <span className="flex ml-2">
                                        <X size={14} onClick={() => setSearch("")} />
                                    </span>
                                </span>

                            </span>
                        </div>}

                </div>
            </div>

            <div className="flex px-4 justify-start">
                <div className="grid gap-6 w-full my-10 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                    {ideas.map((idea) => {
                        const isEditing = editingId === idea.id;

                        return (
                            <div
                                key={idea.id}
                                className="box-content bg-white/50 backdrop-blur-md rounded-[30px] p-6 
                                flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out h-full 
                                hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)] hover:bg-white/70"
                            >


                                <div className={`pb-2.5 flex flex-wrap justify-start ${isEditing ? "opacity-40 pointer-events-none" : ""}`}>

                                    <span className="flex flex-wrap text-[10px] font-medium text-gray-700 cursor-pointer ">
                                        {idea.title.category.map((cat) => {
                                            const categoryColor =
                                                colors.find((color) => color.name === cat.toLowerCase())
                                                    ?.backgroundColor ?? "bg-gray-200 border-gray-400";
                                            return (
                                                <span
                                                    key={cat}
                                                    className={`inline-flex px-2.5 py-1 tracking-[0.5px] rounded-full border mt-2 mr-1 ${categoryColor}`}
                                                    onClick={() => handleChooseCategory(cat)}
                                                >
                                                    {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                                                </span>
                                            );
                                        })}
                                    </span>

                                </div>


                                <Modal isOpen={deleteId === idea.id} onClose={() => setDeleteId(null)}>
                                    <h3 className="font-bold text-lg">
                                        Are you sure you want to delete this idea?
                                    </h3>
                                    <div className="flex mt-10 flex-1 gap-2 justify-between">
                                        <button
                                            className="flex-1 border rounded-full px-6 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors"
                                            onClick={() => setDeleteId(null)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="flex-1 bg-red-600 text-white rounded-full px-6 py-2 hover:bg-red-700 transition-colors"
                                            onClick={(e) => handleDeleteIdea(e, idea.id)}
                                        >
                                            Yes, Delete
                                        </button>
                                    </div>
                                </Modal>

                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            className="flex text-left mt-2.5 text-xl text-[#737791] font-serif italic border-b border-[#737791] bg-transparent outline-none"
                                        />
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="px-4 py-2 flex-1 text-sm border border-[#737791] text-[#737791] hover:bg-[#B0B6CC] hover:border-[#B0B6CC] hover:text-white transition-colors rounded-full"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={(e) => handleApplyUpdate(e, idea.id)}
                                                className="px-4 py-2 flex-1 text-sm text-white bg-[#6366f1] hover:bg-[#4F46E5] transition-colors rounded-full"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    idea.title && (
                                        <p className="flex text-left mt-2.5 text-md text-black font-bold">
                                            {idea.title.name}
                                        </p>
                                    )
                                )}
                                <div className="flex gap-4 pb-3 cursor-pointer mt-auto">
                                    <EditIcon
                                        size={17}
                                        strokeWidth={1.5}
                                        className="hover:text-[#F25E0D]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingId(idea.id);
                                            setEditedTitle(idea.title.name);
                                        }}
                                    />
                                    {copiedId === idea.id
                                        ? <Check
                                            size={16}
                                            strokeWidth={1.5}
                                        />
                                        : <Copy
                                            size={16}
                                            strokeWidth={1.5}
                                            className="hover:text-[#F25E0D]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopyIdea(idea.id, idea.title.name);
                                            }}
                                        />}

                                    <Trash2
                                        size={16}
                                        strokeWidth={1.5}
                                        className="hover:text-[#F25E0D]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteId(idea.id);
                                        }}
                                    />

                                </div>
                            </div>

                        );
                    })}


                    <CreateCard address={"/add-idea"} text={"Create Idea"} />
                </div>
            </div>
        </>
    );
};

export default MyIdeasPage;