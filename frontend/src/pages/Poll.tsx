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
import { Share2, ShoppingBagIcon, Clock, Edit, Trash2, Bell, MoreHorizontal, Gift, Dot, MoveLeft, Plus } from "lucide-react"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { Product } from "../utils/types";
import { useUser } from "../context/UserContext";


export default function PollPage() {
    const { user } = useUser();
    console.log("user", user)
    console.log("user id", user?.id)

    const { uuid } = useParams<{ uuid: string }>();

    const [poll, setPoll] = useState<Poll | null>(null);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedTitle, setEditedTitle] = useState<string>("");
    const [editedBudget, setEditedBudget] = useState<number>(0);

    const [showGiftIdeas, setShowGiftIdeas] = useState(false);
    const [showProducts, setShowProducts] = useState(true)

    const [products, setProducts] = useState<Product[]>([]);

    const navigate = useNavigate();

    const handleShowIdeas = () => {
        setShowGiftIdeas((prev => !prev))
        setShowProducts(true)
    }

    // fetch products
    const getProducts = async () => {
        if (!uuid) return;
        try {
            const response = await authFetch(`http://127.0.0.1:8000/${uuid}/products`);
            const data = await response.json();
            setProducts(data);
            console.log("Products fetched:", data);
            console.log("Amount of products:", data.length)
        } catch (error) {
            console.error(error);
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
            } catch (error) {
                console.error(error);
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
        if (!window.confirm("Are you sure you want to delete this poll?")) return;
        try {
            await deletePoll(uuid);
            navigate("/my-polls");
            console.log("Poll deleted");
        } catch (error: any) {
            console.error(error.message);
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
            console.log("Poll updated");
        } catch (error) {
            console.error("Failed to update poll:", error);
        }
    };


    return (
        <>
            {/* Poll card section */}
            <div className="mx-auto flex justify-center px-4">

                {/* product-container */}
                <div className="grid gap-6 w-full max-w-200 mt-10">
                    <a href="/my-polls" className="flex gap-3 text-[#33aaea] hover:text-[#F25E0D] text-left">
                        <MoveLeft /> Back to polls
                    </a>

                    {/* card-poll */}
                    <div key={poll.uuid} className="bg-white/50 backdrop-blur-md rounded-[30px] p-6 
                    flex flex-col shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)] 
                    transition-all duration-250 h-4/5">

                        {/* poll-text */}
                        <div className="flex justify-between items-start gap-5 m-0">

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

                                            <button onClick={handleApply} className="h-8.75 w-25 flex items-center text-base justify-center bg-[#0096FF] text-white font-normal rounded-xl cursor-pointer">Apply</button>

                                            <button onClick={cancelEditing} className="h-8.75 w-25 flex items-center text-base justify-center bg-[#0096FF] text-white font-normal rounded-xl cursor-pointer">Cancel</button>
                                        </div>
                                    )}
                                </h3>
                            </div>

                            <div className="p-1.5 flex justify-between items-start gap-5 m-0">
                                {!isEditing ? (
                                    <>
                                        {/* add poll from other creators to vote  */}
                                        {user && user.id !== poll.user_id && (
                                            <p className="flex justify-between items-start gap-5 m-0 cursor-pointer" onClick={startEditing}>
                                                <Plus size={20} strokeWidth={1.5} style={{ color: "#737791" }} />
                                            </p>

                                        )}

                                        {user && user.id === poll.user_id && (
                                            <>
                                                <p className="flex justify-between items-start gap-5 m-0 cursor-pointer" onClick={startEditing}>
                                                    <Edit size={20} strokeWidth={1.5} style={{ color: "#737791" }} />
                                                </p>
                                                <p className="flex justify-between items-start gap-5 m-0 cursor-pointer" onClick={(e) => handleDeletePoll(e, poll.uuid)}>
                                                    <Trash2 size={20} strokeWidth={1.5} style={{ color: "#737791" }} />
                                                </p>
                                            </>)}

                                        <p className="flex justify-between items-start gap-5 m-0 cursor-pointer ">
                                            <Bell size={20} strokeWidth={1.5} style={{ color: "#737791" }} />
                                        </p>

                                        <button className="bg-green-300/50 rounded-[20px] inline-flex items-center justify-center px-2 py-1 text-[0.7rem] h-5 text-[#356d8a] border-none cursor-pointer ">
                                            Active
                                        </button>

                                        <p className="flex justify-between items-start gap-5 m-0 cursor-pointer ">
                                            <Share2 size={20} strokeWidth={1.5} style={{ color: "#737791" }} />
                                        </p>
                                        <p className="flex justify-between items-start gap-5 m-0 cursor-pointer ">
                                            <strong><MoreHorizontal size={20} strokeWidth={1.5} color="#356d8a" /></strong>
                                        </p>
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
                                <ShoppingBagIcon size={14} strokeWidth={1.5} /> {products.length} options
                                <span ><Dot className="mx-1" color="#F25E0D" size={14} /></span>
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
                <h1 className="text-left text-[2.0em] leading-tight pt-10">
                    Products
                </h1>

            </div>

            {showProducts ? <Products uuid={uuid} products={products} setProducts={setProducts} getProducts={getProducts} /> : ""}
        </>
    );
};