import { useRef, useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import type { GiftIdea } from "../utils/types";
import type { IdeasProps } from "../utils/types";
import toast from "react-hot-toast";
import AgeSlider from "./AgeSlider";
import SearchIdea from "./SearchIdea";
import { X } from "lucide-react";

export default function Ideas({ getProducts, title, budget }: IdeasProps) {
    // const [eventTitle, setEventTitle] = useState("");
    const [recipientRelation, setRecipientRelation] = useState("");
    const [recipientAge, setRecipientAge] = useState<number>(25);
    const [recipientHobbies, setRecipientHobbies] = useState("");
    const [giftType, setGiftType] = useState("");
    // const [budgetRange, setBudgetRange] = useState("");
    const [ideas, setIdeas] = useState<GiftIdea[]>([]);
    const [loading, setLoading] = useState(false);
    const GiftSuggest = useRef<HTMLHeadingElement | null>(null);

    const [openIdeas, setOpenIdeas] = useState(false)

    const buttonsStyle =
        "w-full rounded-3xl border border-[#737791] px-3 py-2 text-[14px] hover:bg-[#F25E0D] hover:text-white hover:border-0 hover:cursor-pointer";

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await authFetch(
                "http://127.0.0.1:8000/products/suggestion",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        event_type: title,
                        recipient_relation: recipientRelation,
                        recipient_age: recipientAge,
                        recipient_hobbies: recipientHobbies,
                        gift_type: giftType,
                        budget_range: budget,
                    }),
                },
            );
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.detail || data.error || "Failed to get gift ideas");
                console.error("Failed to get gift ideas:", data);
                return;
            }
            setIdeas(data);
            console.log("Gift suggestions:", data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Failed to get gift ideas: ${error.message}`);
                console.error(`Failed to get gift ideas: ${error.message}`);
            } else {
                toast.error("Failed to get gift ideas!");
                console.error("Failed to get gift ideas!", error);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (ideas.length > 0 && GiftSuggest.current) {
            GiftSuggest.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [ideas]);

    useEffect(() => {
  if (ideas.length > 0) {
    setOpenIdeas(true);
  }
}, [ideas]);

    return (
        <>
            {/* wrap-poll */}
            <div className="">
                <div>
                    <section className="">
                        {/* add-poll-form */}
                        <div className="flex justify-center  pb-16 ">
                            <form
                                onSubmit={handleSubmit}
                                className=" w-200 flex-col gap-4 bg-white/40 backdrop-blur-md rounded-[30px] p-6 shadow-md"
                            >
                                <p className="text-[#737791] text-xl text-center font-bold mb-6">
                                    Find the perfect gifts for {title}
                                </p>

                                <p className="text-[#737791] font-semibold text-center mt-4">
                                    Who are they to you?
                                </p>
                                <div className="flex gap-2 mt-4">
                                    {[
                                        "Family",
                                        "Friend",
                                        "Partner",
                                        "Colleague",
                                        "Parent",
                                        "Other",
                                    ].map((relation) => (
                                        <button
                                            key={relation}
                                            type="button"
                                            onClick={() => setRecipientRelation(relation)}
                                            className={`${buttonsStyle} ${recipientRelation === relation
                                                ? "bg-[#F25E0D] text-white border-0"
                                                : ""
                                                }`}
                                        >
                                            {relation}
                                        </button>
                                    ))}
                                </div>

                                <AgeSlider value={recipientAge} onChange={setRecipientAge} />

                                <p className="text-[#737791] font-semibold text-center mt-8">
                                    Select hobbies & interests
                                </p>

                                <div className="flex gap-2 mt-4">
                                    {[
                                        "Sports",
                                        "Music",
                                        "Gaming",
                                        "Books",
                                        "Travel",
                                        "Fitness",
                                        "Fashion"
                                    ].map((hobbies) => (
                                        <button
                                            key={hobbies}
                                            type="button"
                                            onClick={() => setRecipientHobbies(hobbies)}
                                            className={`${buttonsStyle} ${recipientHobbies === hobbies
                                                ? "bg-[#F25E0D] text-white border-0"
                                                : ""
                                                }`}
                                        >
                                            {hobbies}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-4">
                                    {[
                                        "Photography",
                                        "Movies",
                                        "Home decor",
                                        "Technology",
                                        "Art",
                                        "Cooking"
                                    ].map((hobbies) => (
                                        <button
                                            key={hobbies}
                                            type="button"
                                            onClick={() => setRecipientHobbies(hobbies)}
                                            className={`${buttonsStyle} ${recipientHobbies === hobbies
                                                ? "bg-[#F25E0D] text-white border-0"
                                                : ""
                                                }`}
                                        >
                                            {hobbies}
                                        </button>
                                    ))}

                                </div>
                                {/* <p>{title}</p>
                            <p>{recipientRelation}</p>
                            <p>{recipientAge}</p>
                            <p>{recipientHobbies}</p>
                            <p>{giftType}</p>
                            <p>{budget}</p> */}

                                <p className="text-[#737791] font-semibold text-center mt-8">
                                    Select gift type
                                </p>

                                <div className="flex gap-2 mt-4">
                                    {[
                                        "Unique",
                                        "Practical",
                                        "Fun",
                                        "Luxury",
                                        "Handmade",
                                        "Personalized",
                                        "Experience"
                                    ].map((gift) => (
                                        <button
                                            key={gift}
                                            type="button"
                                            onClick={() => setGiftType(gift)}
                                            className={`${buttonsStyle} ${giftType === gift
                                                ? "bg-[#F25E0D] text-white border-0"
                                                : ""
                                                }`}
                                        >
                                            {gift}
                                        </button>
                                    ))}
                                </div>


                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-10 h-13.5 w-full bg-linear-to-r from-orange-500 to-pink-500 text-white font-medium py-2 rounded-xl hover:opacity-90 transition hover:cursor-pointer"
                                >
                                    {loading ? "Loading..." : "Get Ideas"}
                                </button>
                            </form>
                        </div>
                        
                        {ideas.length > 0 && openIdeas && (
                            <h1
                                ref={GiftSuggest}
                                className="text-[1.5em] text-center mb-8 text-[#737791] font-black"
                            >
                                Gift Ideas
                            </h1>
                        )}

                        {/* ideas-list */}
                        {openIdeas && 
                        <div className="max-w-300 mx-auto px-4 bg-[#fefefe] rounded-[30px] ">
                            <div className="flex mr-6 pt-5 justify-end">
                                <X size={30} strokeWidth={2} onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        setOpenIdeas(false);
                                                                    }}
                                                                    className="cursor-pointer"/>
                            </div>
                            {ideas.map((idea, index) => (<div key={index}

                                // className="box-content mb-4"
                                >
                                {/* card-product-ideas px] */}
                                <div 
                                className="flex flex-col gap-3 w-full min-w-75 pl-6 pr-6 "
                                >

                                    {/* gift-idea-search-wrapper */}
                                    <div className="w-full block font-bold mb-4">
                                        <SearchIdea userSearch={idea.name} getProducts={getProducts} />
                                        {/* <p className="flex text-left"> {idea.description} </p> */}
                                        {/* product-description */}
                                        {/* <div className="flex text-left font-normal">
                                            {idea.description}
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>}
                    </section>
                </div>
            </div>
        </>
    );
}
