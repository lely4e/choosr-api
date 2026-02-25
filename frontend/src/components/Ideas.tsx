import { useRef, useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import Search from "../components/Search";
import type { GiftIdea } from "../utils/types";
import type { IdeasProps } from "../utils/types";
import toast from "react-hot-toast";

export default function Ideas({ getProducts }: IdeasProps) {
    const [eventTitle, setEventTitle] = useState("");
    const [recipientRelation, setRecipientRelation] = useState("");
    const [recipientAge, setRecipientAge] = useState("");
    const [recipientHobbies, setRecipientHobbies] = useState("");
    const [giftType, setGiftType] = useState("");
    const [budgetRange, setBudgetRange] = useState("");
    const [ideas, setIdeas] = useState<GiftIdea[]>([]);
    const [loading, setLoading] = useState(false);
    const GiftSuggest = useRef<HTMLHeadingElement | null>(null);

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
                        event_type: eventTitle,
                        recipient_relation: recipientRelation,
                        recipient_age: recipientAge,
                        recipient_hobbies: recipientHobbies,
                        gift_type: giftType,
                        budget_range: budgetRange,
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

    return (
        <>
            {/* wrap-poll */}
            <div className="mx-auto flex px-4 justify-center">
                <section>
                    {/* add-poll-form */}
                    <div className="flex flex-col items-center w-full px-4 pb-16 max-w-5xl mx-auto">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-md"
                        >
                            <p className="text-gray-600 text-center font-medium mb-2">
                                Get the best gift suggestions
                            </p>

                            <label htmlFor="event" className="text-gray-700 font-semibold">
                                Event
                            </label>
                            <input
                                id="event"
                                type="text"
                                placeholder="Mike's Birthday"
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />

                            <label htmlFor="relation" className="text-gray-700 font-semibold">
                                Recipient Relation
                            </label>
                            <input
                                id="relation"
                                type="text"
                                placeholder="Friend, Family, Colleague"
                                value={recipientRelation}
                                onChange={(e) => setRecipientRelation(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />

                            <label htmlFor="age" className="text-gray-700 font-semibold">
                                Recipient Age
                            </label>
                            <input
                                id="age"
                                type="text"
                                placeholder="23"
                                value={recipientAge}
                                onChange={(e) => setRecipientAge(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />

                            <label
                                htmlFor="interests"
                                className="text-gray-700 font-semibold"
                            >
                                Hobbies / Interests
                            </label>
                            <input
                                id="interests"
                                type="text"
                                placeholder="Sports, Music, Art, etc."
                                value={recipientHobbies}
                                onChange={(e) => setRecipientHobbies(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />

                            <label
                                htmlFor="gift-type"
                                className="text-gray-700 font-semibold"
                            >
                                Gift Type
                            </label>
                            <input
                                id="gift-type"
                                type="text"
                                placeholder="Unique, Practical, Fun, etc."
                                value={giftType}
                                onChange={(e) => setGiftType(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />

                            <label
                                htmlFor="budget-range"
                                className="text-gray-700 font-semibold"
                            >
                                Budget Range
                            </label>
                            <input
                                id="budget-range"
                                type="text"
                                placeholder="350-400"
                                value={budgetRange}
                                onChange={(e) => setBudgetRange(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 w-full bg-linear-to-r from-orange-500 to-pink-500 text-white font-medium py-2 rounded-xl hover:opacity-90 transition"
                            >
                                {loading ? "Loading..." : "Get Ideas"}
                            </button>
                        </form>
                    </div>
                    {ideas.length > 0 && (
                        // login
                        <h1
                            ref={GiftSuggest}
                            className=" text-center mb-8 text-[#737791] text-[24px] "
                        >
                            Gift suggestions
                        </h1>
                    )}

                    {/* ideas-list */}
                    <div className="max-w-300 mx-auto px-4">
                        {ideas.map((idea, index) => (
                            <div key={index} className="mb-4">
                                {/* card-product-ideas px] */}
                                <div className="flex flex-col gap-3 w-full min-w-75 p-6 pt-3 bg-[#fefefe] rounded-[20px] shadow-[0_6px_15px_rgba(0,0,0,0.08)]">
                                    {/* gift-idea-search-wrapper */}
                                    <div className="w-full block font-bold">
                                        <Search userSearch={idea.name} getProducts={getProducts} />

                                        {/* <p className="flex text-left">
                                            {idea.description}
                                        </p> */}
                                        {/* product-description */}
                                        <div className="flex text-left font-normal">
                                            {idea.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
