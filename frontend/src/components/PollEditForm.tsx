import { Clock } from "lucide-react";
import Toggle from "./Toggle";
import toast from "react-hot-toast";

interface PollEditFormProps {
    editedTitle: string;
    setEditedTitle: (title: string) => void;
    editedBudget: number;
    setEditedBudget: (bud: number) => void;
    editedDescription: string;
    editedDeadline: string;
    editedManuallyClosed: boolean;
    setEditedManuallyClosed: (clos: boolean) => void;
    setEditedDescription: (desc: string) => void;
    setEditedDeadline: (deadline: string) => void;
    cancelEditing: () => void;
    handleApply: () => void;
}

export default function PollEditForm({
    editedTitle,
    setEditedTitle,
    editedBudget,
    setEditedBudget,
    editedManuallyClosed,
    setEditedManuallyClosed,
    editedDescription,
    editedDeadline,
    setEditedDescription,
    setEditedDeadline,
    cancelEditing,
    handleApply,
}: PollEditFormProps) {
    return (
        <div
            className="bg-white/50 backdrop-blur-md rounded-[30px] p-6 
            flex flex-col shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)] 
            transition-all duration-250 h-4/5"
        >
            <div className="flex justify-between gap-2.5">
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className=" w-full border-b border-[#737791] bg-transparent outline-none text-left font-bold text-3xl text-black"
                />
                <div className="text-xs font-bold text-gray-700">
                    <Toggle
                        initial={!editedManuallyClosed}
                        onChange={(checked) => {
                            setEditedManuallyClosed(!checked);
                            {
                                !editedManuallyClosed
                                    ? toast.success("Poll closed")
                                    : toast.success("Poll opened");
                            }
                        }}
                    />
                </div>
            </div>
            <p className="flex items-start mt-2.5 text-sm text-black">
                Budget: $
                <input
                    type="number"
                    value={editedBudget}
                    onChange={(e) => setEditedBudget(Number(e.target.value))}
                    className="border-b border-[#737791] bg-transparent outline-none focus:outline-none flex justify-between items-start text-sm text-black"
                />
            </p>
            <input
                type="text"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="border-b border-[#737791] bg-transparent outline-none flex text-left mt-2.5 text-sm text-[#737791] font-serif italic"
            />
            <div className="flex items-bottom mb-2 text-[14px] text-[#EA7317] justify-between">
                <div className="flex w-full items-center mt-10 mb-10 gap-2 text-[14px] text-[#EA7317]">
                    <Clock size={14} strokeWidth={2} />
                    <input
                        type="date"
                        placeholder="Date"
                        value={editedDeadline || ""}
                        onChange={(e) => setEditedDeadline(e.target.value)}
                        className="bg-[#F25E0D] text-white px-6 py-2 rounded-full"
                    />
                    <button
                        onClick={cancelEditing}
                        className="ml-40 px-6 py-2 w-full flex-1 items-center text-base justify-center border border-[#737791] text-[#737791] hover:bg-[#B0B6CC] hover:border-[#B0B6CC] hover:text-white transition-colors font-normal rounded-full cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-6 py-2 w-full flex-1 items-center text-base justify-center text-white bg-[#6366f1] hover:bg-[#4F46E5] hover:text-white transition-colors font-normal rounded-full cursor-pointer"
                    >
                        Apply
                    </button>
                </div>
                <div></div>
            </div>
        </div>
    );
}
