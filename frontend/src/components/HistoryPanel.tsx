import { Trash2, Copy, Bookmark, Dot, Check } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "./Modal";
import { colors } from "../utils/colors";
import type { History } from "../utils/types";

interface HistoryPanelProps {
    history: History[];
    uuid: string;
    openHistoryDelete: number | null;
    setOpenHistoryDelete: (id: number | null) => void;
    onDelete: (e: React.MouseEvent, historyId: number) => void;
    onAddToIdeas: (historyId: number) => void;
    onCopy: (id:number, name: string) => void; // function
    copiedId: number | null; // bumber
}

export default function HistoryPanel({
    history,
    openHistoryDelete,
    setOpenHistoryDelete,
    onDelete,
    onAddToIdeas,
    onCopy,
    copiedId,
}: HistoryPanelProps) {
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-200 flex-col bg-white/40 backdrop-blur-md rounded-[30px] p-6 shadow-md space-y-2">

                {/* AI badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                    animate={{ opacity: 1, scale: 1, rotate: -8 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="absolute -top-4 -right-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#e4c3f9] rounded-full shadow-lg"
                >
                    <motion.div
                        animate={{ scale: [0.7, 1.2, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2.5 h-2.5 rounded-full bg-[#ba4cea]"
                    />
                    <span className="text-sm font-bold text-[#ba4cea]">AI GENERATED</span>
                </motion.div>

                <h2 className="text-center text-xl font-black mb-6">Your AI Idea History</h2>

                <div className="flex justify-center items-center text-center text-sm text-[#737791] font-serif italic mb-6">
                    <p>AI-generated suggestions, saved over time</p>
                    <Dot />
                    <span>
                        <span className="text-[#ba4cea] font-black">{history.length}</span> ideas collected
                    </span>
                </div>

                {history.map((idea) => (
                    <div
                        key={idea.id}
                        className="flex justify-between items-center text-left text-[14px] border py-2 px-4 rounded-xl border-[#d9dce7] hover:bg-[#d9dce7]"
                    >
                        <div>
                            <div className="flex gap-2 mb-2 text-[10px] text-gray-700 tracking-widest">
                                {idea.titles.category.map((cat) => {
                                    const categoryColor =
                                        colors.find((c) => c.name === cat.toLowerCase())?.backgroundColor
                                        ?? "bg-gray-200 border-gray-400";
                                    return (
                                        <span
                                            key={cat}
                                            className={`inline-flex items-center tracking-[0.5px] gap-1.5 px-2.5 py-1 rounded-full border ${categoryColor}`}
                                        >
                                            {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                                        </span>
                                    );
                                })}
                            </div>
                            <span className="flex text-left">{idea.titles.name}</span>
                        </div>

                        <div className="flex gap-1">
                            {/* Delete */}
                            <div
                                className="py-2 px-2 rounded-full hover:text-[#f20d0d] hover:bg-white cursor-pointer"
                                onClick={() => setOpenHistoryDelete(idea.id)}
                            >
                                <Trash2 size={16} strokeWidth={1.5} />
                            </div>

                            <Modal
                                isOpen={openHistoryDelete === idea.id}
                                onClose={() => setOpenHistoryDelete(null)}
                            >
                                <h3 className="font-bold text-lg">
                                    Are you sure you want to delete "{idea.titles.name}"?
                                </h3>
                                <div className="flex mt-10 flex-1 gap-2 justify-between">
                                    <button
                                        className="flex-1 border rounded-full px-6 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors"
                                        onClick={() => setOpenHistoryDelete(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="flex-1 bg-red-600 text-white rounded-full px-6 py-2 hover:bg-red-700 transition-colors"
                                        onClick={(e) => onDelete(e, idea.id)}
                                    >
                                        Yes, Delete
                                    </button>
                                </div>
                            </Modal>

                            {/* Copy */}
                           
                            <div 
                                onClick={() => onCopy(idea.id, idea.titles.name)}
                            className="py-2 px-2 rounded-full hover:text-[#08b9ff] hover:bg-white cursor-pointer">
                                 {copiedId === idea.id
                                ? <Check size={16} strokeWidth={1.5} />
                                : <Copy size={16} strokeWidth={1.5} />}
                            </div>


                            {/* Save to ideas */}
                            <div
                                className="py-2 px-2 rounded-full hover:text-[#a900dc] hover:bg-white cursor-pointer"
                                onClick={() => onAddToIdeas(idea.id)}
                            >
                                <Bookmark size={16} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}