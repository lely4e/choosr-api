import Modal from "./Modal";
import {
    type Poll,
    type History,
    type Activities,
    type User,
    type Product,
} from "../utils/types";
import {
    ArrowCounterClockwiseIcon,
    CalendarBlankIcon,
    CalendarCheckIcon,
    CalendarIcon,
    CaretUpIcon,
    CheckIcon,
    DotIcon,
    LinkIcon,
    MagicWandIcon,
    PencilSimpleLineIcon,
    PlusIcon,
    ShareFatIcon,
    ShoppingCartSimpleIcon,
    TrashSimpleIcon,
    XIcon,
} from "@phosphor-icons/react";
import NoteCard from "./NoteCard";
import { daysLeft } from "../utils/date";
import { Tooltip } from "./Tooltip";
import { motion } from "framer-motion";

interface PollCardProps {
    poll: Poll;
    uuid: string;
    user: User | null;
    activities: Activities[];
    products: Product[];
    history: History[];
    isEditing: boolean;
    editedTitle: string;
    editedManuallyClosed: boolean;
    editedBudget: number;
    open: boolean;
    openPoll: boolean;
    share: boolean;
    copied: boolean;
    setOpen: (open: boolean) => void;
    setOpenPoll: (open: boolean) => void;
    setShare: (share: boolean) => void;
    setEditedTitle: (title: string) => void;
    setEditedManuallyClosed: (closed: boolean) => void;
    setEditedBudget: (budget: number) => void;
    startEditing: () => void;
    handleDeletePoll: (e: React.MouseEvent, uuid: string) => void;
    handleAddSharedPoll: (uuid: string) => void;
    handleDeleteSharedPoll: (uuid: string) => void;
    handleCopy: () => void;
    handleToggleHistory: () => void;
    handleShowIdeas: () => void;
    showGiftIdeas: boolean;
    handleShowEdit: () => void;
}

export default function PollCard({
    poll,
    uuid,
    user,
    activities,
    history,
    open,
    openPoll,
    share,
    copied,
    setOpen,
    setOpenPoll,
    setShare,
    startEditing,
    handleDeletePoll,
    handleAddSharedPoll,
    handleDeleteSharedPoll,
    handleCopy,
    handleToggleHistory,
    handleShowIdeas,
    showGiftIdeas,
    handleShowEdit,
}: PollCardProps) {
    return (
        <motion.div
            key={poll.uuid}
            id={poll.uuid}
            className="bg-white/50 backdrop-blur-md rounded-[30px] p-6 
            flex flex-col shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)] 
            transition-all duration-250 h-4/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0, duration: 0.6 }}
            data-testid="poll-card">
            {/* active + icons */}
            <div className="flex justify-between items-center mb-2 gap-2 flex-wrap">

                {/* poll-text */}
                <div className="flex justify-between items-center m-0">
                    {/* poll-title-container */}
                    <div className="min-h-6 flex-1 mr-3">
                        <h3 className="text-left m-0 font-bold text-3xl text-black ">
                            {poll.title}
                        </h3>
                    </div>


                    <div className="">
                        {/* active status */}
                        <div className="flex items-center justify-between">
                            {/* <div
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full "
                                style={{ backgroundColor: poll.active ? "#C8E6C9" : "#FFCDD2" }}
                            > */}
                            <div className="relative w-2 h-2">
                                {poll.active && (
                                    <div
                                        className="absolute inset-0 rounded-full animate-ping"
                                        style={{ backgroundColor: "#4CAF50", opacity: 0.6 }}
                                    />
                                )}
                                <div
                                    className="relative w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor: poll.active ? "#4CAF50" : "#F44336",
                                    }}
                                />
                                {/* </div> */}
                                {/* <span className="text-[10px] font-bold text-gray-700 tracking-[0.5px]">
                                    {poll.active ? "Active" : "Closed"}
                                </span> */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* icons block */}
                <div className="flex text-[#737791] items-center flex-wrap">
                    {/* add poll from other creators to vote  */}
                    {user && user.id !== poll.user_id && activities && (
                        <>
                            <div className="flex cursor-pointer hover:text-[#F25E0D] mr-3">
                                {!activities.some((activity) => activity.uuid === poll.uuid) ? (
                                    <PlusIcon
                                        size={16}
                                        data-testid="add-poll-icon"
                                        className="hover:text-[#F25E0D]"
                                        onClick={() => handleAddSharedPoll(poll.uuid)}
                                    />
                                ) : (
                                    <TrashSimpleIcon
                                        size={16}

                                        strokeWidth={1.5}
                                        className="hover:text-[#F25E0D]"
                                        onClick={() => setOpenPoll(true)}
                                    />
                                )}
                            </div>
                            <p className="flex  cursor-pointer hover:text-[#F25E0D]">
                                <ShareFatIcon
                                    size={16}

                                    strokeWidth={1.5}
                                    onClick={() => setShare(true)}
                                />
                            </p>
                        </>
                    )}

                    {/* delete shared poll */}
                    <Modal isOpen={openPoll} onClose={() => setOpenPoll(false)}>
                        <h3 className="font-bold text-lg ">
                            Are you sure you want to delete this shared poll?
                        </h3>
                        <div className="flex mt-10 flex-1 gap-2 justify-between">
                            <button
                                className="flex-1 border rounded-full px-6 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors"
                                onClick={() => setOpenPoll(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 bg-red-600 text-white rounded-full px-6 py-2 hover:bg-red-700 hover:text-white transition-colors"
                                onClick={() => handleDeleteSharedPoll(poll.uuid)}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </Modal>

                    {user && user.id === poll.user_id && (
                        <>
                            <p
                                className="group relative flex mr-3 items-start cursor-pointer 
                                hover:text-[#F25E0D]"
                                onClick={() => {
                                    startEditing();
                                    handleShowEdit();
                                }}
                            >
                                <PencilSimpleLineIcon
                                    size={16}
                                    strokeWidth={1.5}
                                    data-testid="edit-icon"
                                />
                                <Tooltip text="Edit" />
                            </p>

                            <p className="group relative flex mr-3 items-start  cursor-pointer hover:text-[#F25E0D]">
                                <TrashSimpleIcon
                                    size={16}
                                    strokeWidth={1.5}
                                    onClick={() => setOpen(true)}
                                />
                                <Tooltip text="Delete" />
                            </p>

                            <p className="group relative flex cursor-pointer  hover:text-[#F25E0D]">
                                <ShareFatIcon
                                    size={17}
                                    onClick={() => setShare(true)}
                                />
                                <Tooltip text="Share" />
                            </p>

                            <div>
                                <Modal isOpen={open} onClose={() => setOpen(false)}>
                                    <h3 className="font-bold text-lg ">
                                        Are you sure you want to delete this poll?
                                    </h3>
                                    <div className="flex mt-10 flex-1 gap-2 justify-between">
                                        <button
                                            className="flex-1 border rounded-full px-6 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors"
                                            onClick={() => setOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="flex-1 bg-red-600 text-white rounded-full px-6 py-2 hover:bg-red-700 hover:text-white transition-colors"
                                            onClick={(e) => handleDeletePoll(e, poll.uuid)}
                                        >
                                            Yes, Delete
                                        </button>
                                    </div>
                                </Modal>
                            </div>
                        </>
                    )}
                    {/* share modal */}
                    <div>
                        <Modal isOpen={share} onClose={() => setShare(false)}>
                            <div className="flex justify-between">
                                <h3 className="font-bold text-lg mb-4.5 text-center ">
                                    Your event link for{" "}
                                    <span className="text-[#F25E0D]">{poll.title}</span> is ready
                                    to share! 🎉
                                </h3>
                                <XIcon
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShare(false);
                                    }}
                                    className="cursor-pointer"
                                    size={20}
                                    weight="bold"
                                />
                            </div>
                            <div className="flex">
                                <input
                                    className="border-0 border-b border-[#F25E0D] bg-transparent text-[#737791] pl-2.5 text-base w-125 h-12 focus:outline-none"
                                    id={uuid}
                                    value={`${window.location.origin}/polls/${uuid}`}
                                    readOnly
                                />
                                <button
                                    onClick={handleCopy}
                                    className={`px-4 border-[#F25E0D] hover:bg-black h-12 hover:text-white transition-colors rounded-full
                                                ${!copied ? "bg-[#F25E0D] text-white cursor-pointer" : "bg-[#B0B6CC]"}`}
                                >
                                    {!copied ? (
                                        <LinkIcon size={16} strokeWidth={2} weight="bold" />
                                    ) : (
                                        <CheckIcon
                                            size={16}
                                            strokeWidth={2}
                                            style={{ color: "white" }}
                                            weight="bold"
                                        />
                                    )}
                                </button>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>

            {/* budget */}
            <div className="min-h-6 flex">
                <p className="flex justify-between items-start mt-1 text-sm text-black">
                    Budget: ${poll.budget}
                </p>
            </div>

            {/* description */}
            {poll.description && (
                <NoteCard>
                    <p className="flex text-left mt-0 text-sm text-[#737791] font-serif italic ">
                        {poll.description}
                    </p>
                </NoteCard>
            )}

            <div className="flex items-bottom mb-6 gap-2 ml-0 text-[14px] text-[#EA7317] justify-between">
                <div className="flex items-center mt-10 mb-10 gap-2 ml-0 text-[12px] text-[#EA7317]">
                    <ShoppingCartSimpleIcon size={14} weight="fill" strokeWidth={2} />
                    {poll.total_products} {poll.total_products === 1 ? "item" : "items"}
                    <span>
                        <DotIcon className="text-[#F25E0D]" size={22} weight="bold" />
                    </span>
                    {poll.deadline ? (
                        daysLeft(poll) > 0 ? (
                            <>
                                <CalendarIcon size={14} strokeWidth={1.5} weight="fill" />
                                <span>
                                    {daysLeft(poll)}{" "}
                                    {daysLeft(poll) === 1 ? "day left" : "days left"}
                                </span>
                            </>
                        ) : (
                            <>
                                <CalendarCheckIcon size={14} strokeWidth={1.5} weight="fill" />
                                <span>Finished</span>
                            </>
                        )
                    ) : (
                        <>
                            <CalendarBlankIcon size={14} strokeWidth={1.5} />
                            <span>No deadline</span>
                        </>
                    )}
                    {user && poll.user_id !== user.id && (
                        <>
                            <span>
                                <DotIcon className="text-[#F25E0D]" size={22} weight="bold" />
                            </span>
                            {/* <UserCircleIcon size={14} weight="fill" strokeWidth={1.5} /> */}
                            <img
                                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${poll.user_id}`}
                                alt="avatar"
                                className="w-5"
                            />
                            created by {poll.created_by}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 mb-6">
                    {history.length !== 0 ? (
                        <div
                            className="flex  items-center justify-center gap-2 font-medium text-[12px] text-[#9900ff] border border-[#9900ff]
                                rounded-full px-4 py-2 cursor-pointer
                                transform transition duration-300 ease-in-out
                                hover:scale-105"
                            onClick={handleToggleHistory}
                        >
                            <ArrowCounterClockwiseIcon
                                size={16}
                                weight="bold"
                                strokeWidth={2}
                            />
                            <span>History</span>
                        </div>
                    ) : (
                        ""
                    )}
                    <button
                        onClick={handleShowIdeas}
                        className="flex items-center justify-center gap-2 font-medium text-[14px] text-white bg-linear-to-r from-[#9900ff] to-pink-500 
                                rounded-full px-4 py-2 cursor-pointer 
                                transform transition duration-300 ease-in-out
                                hover:scale-105"
                    >
                        {!showGiftIdeas ? (
                            <>
                                <MagicWandIcon size={16} weight="fill" strokeWidth={1.5} />
                                <span>Get AI gift ideas</span>
                            </>
                        ) : (
                            <>
                                <CaretUpIcon size={16} weight="fill" strokeWidth={1.5} />
                                <span>Get AI gift ideas</span>
                            </>

                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
