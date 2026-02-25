import React, { useEffect, useState } from "react";
import type { Poll } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { deletePoll } from "../utils/deletePoll";
import { updatePoll } from "../utils/updatePoll";
import Search from "../components/Search";
import Ideas from "../components/Ideas";
import Products from "../components/Products";
import {
    Share2,
    ShoppingBagIcon,
    Clock,
    Edit,
    Trash2,
    Bell,
    MoreHorizontal,
    Gift,
    Dot,
    MoveLeft,
    Plus,
    Copy,
    Check,
    X,
} from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { Product } from "../utils/types";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import ReactDOM from "react-dom";

export default function PollPage() {
    const { user } = useUser();
    console.log("user", user);
    console.log("user id", user?.id);

    const { uuid } = useParams<{ uuid: string }>();

    const [poll, setPoll] = useState<Poll | null>(null);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedTitle, setEditedTitle] = useState<string>("");
    const [editedBudget, setEditedBudget] = useState<number>(0);

    const [showGiftIdeas, setShowGiftIdeas] = useState(false);
    const [showProducts, setShowProducts] = useState(true);

    const [products, setProducts] = useState<Product[]>([]);

    const [open, setOpen] = useState(false);
    const [share, setShare] = useState(false);
    const [copied, setCopied] = useState(false);

    const navigate = useNavigate();

    const handleShowIdeas = () => {
        setShowGiftIdeas((prev) => !prev);
        setShowProducts(true);
    };

    // fetch products
    const getProducts = async () => {
        if (!uuid) return;
        try {
            const response = await authFetch(
                `http://127.0.0.1:8000/${uuid}/products`,
            );
            const data = await response.json();
            setProducts(data);
            console.log("Products fetched:", data);
            console.log("Amount of products:", data.length);
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

    useEffect(() => {
        if (!uuid) return;
        getProducts();
    }, [uuid]);

    useEffect(() => {
        const getPoll = async () => {
            if (!uuid) return;
            try {
                const response = await authFetch(`http://127.0.0.1:8000/${uuid}`);
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

    if (!poll) {
        return (
            <div>
                <p>Loading poll...</p>
            </div>
        );
    }

    // delete poll
    const handleDeletePoll = async (e: React.MouseEvent, uuid: string) => {
        e.stopPropagation();
        // if (!window.confirm("Are you sure you want to delete this poll?")) return;
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
        setIsEditing(true);
        setEditedTitle(poll.title);
        setEditedBudget(poll.budget);
    };

    const cancelEditing = () => setIsEditing(false);

    const handleApply = async () => {
        if (!uuid) return;
        try {
            await updatePoll(uuid!, editedTitle, editedBudget);
            setPoll({ ...poll!, title: editedTitle, budget: editedBudget });
            setIsEditing(false);
            toast.success("Poll updated successfully!", {
                duration: 2000,
            });
            console.log("Poll updated");
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
        const linkToCopy = `https://choosr/polls/${uuid}`;

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

    return (
        <>
            {/* Poll card section */}
            <div className="mx-auto flex justify-center px-4">
                {/* product-container */}
                <div className="grid gap-6 w-full max-w-200 mt-10">
                    <a
                        href="/my-polls"
                        className="flex gap-3 text-[#33aaea] hover:text-[#F25E0D] text-left"
                    >
                        <MoveLeft /> Back to polls
                    </a>

                    {/* card-poll */}
                    <div
                        key={poll.uuid}
                        className="bg-white/50 backdrop-blur-md rounded-[30px] p-6 
                    flex flex-col shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)] 
                    transition-all duration-250 h-4/5"
                    >
                        {/* poll-text */}
                        <div className="flex justify-between items-start m-0">
                            {/* poll-title-container */}
                            <div className="min-h-6 flex">
                                <h3 className="text-left m-0 font-bold text-3xl text-black">
                                    {!isEditing ? (
                                        poll.title
                                    ) : (
                                        <div className="flex justify-between gap-2.5">
                                            <p className="flex justify-between items-start gap-5 mt-2.5 text-sm text-black font-normal text-[15px] mr-7.5">
                                                Title:
                                            </p>
                                            <input
                                                type="text"
                                                value={editedTitle}
                                                onChange={(e) => setEditedTitle(e.target.value)}
                                                className="rounded-lg border border-[#3bb5f6] bg-transparent text-[#737791] pl-2.5 h-8.75 text-base font-normal w-75"
                                            />

                                            <button
                                                onClick={handleApply}
                                                className="h-8.75 w-25 flex items-center text-base justify-center bg-[#0096FF] text-white font-normal rounded-xl cursor-pointer"
                                            >
                                                Apply
                                            </button>

                                            <button
                                                onClick={cancelEditing}
                                                className="h-8.75 w-25 flex items-center text-base justify-center bg-[#0096FF] text-white font-normal rounded-xl cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </h3>
                            </div>

                            <div className="pt-1.5 flex justify-between m-0">
                                {!isEditing ? (
                                    <>
                                        {/* add poll from other creators to vote  */}
                                        {user && user.id !== poll.user_id && (
                                            <div
                                                className="flex  mr-4 cursor-pointer"
                                                onClick={startEditing}
                                            >
                                                <Plus
                                                    size={20}
                                                    strokeWidth={1.5}
                                                    className="hover:text-[#F25E0D]"
                                                />
                                            </div>
                                        )}

                                        {user && user.id === poll.user_id && (
                                            <>
                                                <p
                                                    className="flex justify-between items-start gap-5 mr-4 cursor-pointer"
                                                    onClick={startEditing}
                                                >
                                                    <Edit
                                                        size={20}
                                                        strokeWidth={1.5}
                                                        className="hover:text-[#F25E0D]"
                                                    />
                                                </p>
                                                <div>
                                                    <p className="flex justify-between items-start gap-5 mr-4 cursor-pointer">
                                                        <Trash2
                                                            size={19}
                                                            strokeWidth={1.5}
                                                            className="hover:text-[#F25E0D]"
                                                            onClick={() => setOpen(true)}
                                                        />
                                                    </p>

                                                    {open &&
                                                        ReactDOM.createPortal(
                                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                                                <div className="bg-white p-10 rounded-2xl">
                                                                    <h3 className="font-bold text-lg ">
                                                                        Are you sure you want to delete this poll?
                                                                    </h3>

                                                                    <div className="flex mt-10 flex-1 gap-2 justify-between">
                                                                        <button
                                                                            className="flex-1 border  rounded-xl px-6 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors"
                                                                            onClick={() => setOpen(false)}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            className="flex-1  bg-red-600 text-white rounded-xl px-6 py-2 hover:bg-red-700 hover:text-white transition-colors"
                                                                            onClick={(e) =>
                                                                                handleDeletePoll(e, poll.uuid)
                                                                            }
                                                                        >
                                                                            Yes, Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>,
                                                            document.body,
                                                        )}
                                                </div>
                                            </>
                                        )}

                                        {/* <p className="flex justify-between items-start gap-5 mr-4 cursor-pointer ">
                                            <Bell
                                                size={19.5}
                                                strokeWidth={1.5}
                                                style={{ color: "#737791" }}
                                            />
                                        </p> */}

                                        <button className="bg-green-300/50 rounded-[20px] inline-flex items-center justify-center px-2 py-1 text-[0.7rem] h-5 text-[#356d8a] border-none cursor-pointer mr-4 ">
                                            Active
                                        </button>

                                        <p className="flex justify-between  m-0 cursor-pointer">
                                            <Share2
                                                size={18.5}
                                                strokeWidth={1.5}
                                                className="hover:text-[#F25E0D]"
                                                onClick={() => setShare(true)}
                                            />
                                        </p>

                                        <div>
                                            {share &&
                                                ReactDOM.createPortal(
                                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999">
                                                        <div className="bg-white p-10 rounded-2xl z-50 justify-between g-3">
                                                            <div className="flex justify-between">
                                                                <h3 className="font-bold text-lg mb-4.5 text-center ">
                                                                    Your event link is ready to share! 🎉
                                                                </h3>
                                                                <X
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        setShare(false);
                                                                    }}
                                                                    className="cursor-pointer"
                                                                />
                                                            </div>
                                                            <div className="flex">
                                                                <input
                                                                    className="border border-[#F25E0D] bg-transparent text-[#737791] pl-2.5 text-base w-125 h-12 "
                                                                    id={uuid}
                                                                    value={`https://choosr/polls/${uuid}`}
                                                                    readOnly
                                                                />

                                                                {/* <div className="flex mt-10 flex-1 gap-2 justify-between"> */}
                                                                <button
                                                                    onClick={handleCopy}
                                                                    className={` px-6  border-[#F25E0D] hover:bg-black h-12 hover:text-white transition-colors
                                                                    ${!copied
                                                                            ? "bg-[#F25E0D] text-white cursor-pointer"
                                                                            : "bg-[#B0B6CC]"
                                                                        }
                                                                `}
                                                                >
                                                                    {!copied ? (
                                                                        <Copy size={20} strokeWidth={2} />
                                                                    ) : (
                                                                        <Check
                                                                            size={20}
                                                                            strokeWidth={2}
                                                                            style={{ color: "white" }}
                                                                        />
                                                                    )}
                                                                </button>

                                                                {/* </div> */}
                                                            </div>
                                                        </div>
                                                    </div>,
                                                    document.body,
                                                )}
                                        </div>
                                        {/* <p className="flex justify-between items-start gap-5 m-0 cursor-pointer ">
                                            <strong>
                                                <MoreHorizontal
                                                    size={20}
                                                    strokeWidth={1.5}
                                                    color="#356d8a"
                                                />
                                            </strong>
                                        </p> */}
                                    </>
                                ) : null}
                            </div>
                        </div>

                        <div className="min-h-6 flex">
                            <p className="flex justify-between items-start gap-5 mt-2.5 text-sm text-black">
                                Budget:&nbsp;
                                {!isEditing ? (
                                    `${poll.budget}$`
                                ) : (
                                    <input
                                        type="number"
                                        value={editedBudget}
                                        onChange={(e) => setEditedBudget(Number(e.target.value))}
                                        className="rounded-lg border border-[#3bb5f6] bg-transparent text-[#737791] pl-2.5 h-8.75 text-base w-75"
                                    />
                                )}
                            </p>
                        </div>
                        <p className="flex text-left  mt-2.5 text-sm text-[#737791]">
                            Here will be a short description that you could add to your poll
                        </p>

                        <div className="flex items-bottom  mb-2 gap-2 ml-0 text-[14px] text-[#EA7317] justify-between">
                            <div className="flex items-center mt-10 mb-10 gap-2 ml-0 text-[14px] text-[#EA7317]">
                                <ShoppingBagIcon size={14} strokeWidth={1.5} />{" "}
                                {products.length} options
                                <span>
                                    <Dot className="mx-1" color="#F25E0D" size={14} />
                                </span>
                                <Clock size={14} strokeWidth={1.5} /> 2 days
                            </div>
                            <div>
                                <button
                                    onClick={handleShowIdeas}
                                    className="flex items-center font-medium text-[16px] text-white bg-linear-to-r from-[#9900ff] to-pink-500 
                                    rounded-[30px] px-4 py-2 h-14 cursor-pointer
                                    transform transition duration-300 ease-in-out
                                    hover:scale-105"
                                >
                                    <Gift size={30} strokeWidth={1.5} />
                                    {!showGiftIdeas ? "" : "Hide Gift Ideas"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center ">
                {showGiftIdeas && <Ideas getProducts={getProducts} />}

                <p className="flex flex-col items-center text-[14px] text-[#737791]">
                    Search and add products to compare and vote.
                </p>

                <Search getProducts={getProducts} />
                <h1 className="text-left text-[2.0em] leading-tight pt-10">Products</h1>
            </div>

            {showProducts ? (
                <Products
                    uuid={uuid}
                    products={products}
                    setProducts={setProducts}
                    getProducts={getProducts}
                />
            ) : (
                ""
            )}
        </>
    );
}
