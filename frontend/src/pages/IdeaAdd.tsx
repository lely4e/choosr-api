import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import { colors } from "../utils/colors";
import { ChevronDown } from "lucide-react";

export default function addIdea() {
    const [title, setTitle] = useState("");
    const [categoryRelation, setCategoryRelation] = useState("");
    const [categoryHobbies, setCategoryHobbies] = useState("");
    const [categoryGift, setCategoryGift] = useState("");

    const navigate = useNavigate();

    const getCategoryColor = (category?: string) => {
        if (!category) return "bg-gray-200 border-gray-400";

        return (
            colors.find((color) => color.name === category.toLowerCase())
                ?.backgroundColor ?? "bg-gray-200 border-gray-400"
        );
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // prevent refreshing page

        try {
            const response = await authFetch(`${API_URL}/ideas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: title,
                    category: [categoryRelation, categoryHobbies, categoryGift],
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error to add idea:", data);
                toast.error("Error to add idea");
                return;
            }

            console.log("Idea created successfully:", data);
            toast.success("Idea created successfully!", {
                duration: 2000,
            });

            setTimeout(() => {
                navigate("/my-ideas");
            }, 1000);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Error to add idea: ${error.message}`);
                console.error(`Error to add idea: ${error.message}`);
            } else {
                toast.error("Error to add idea!");
                console.error("Error to add idea!", error);
            }
        }
    }


    return (
        <>
            {/* wrap-title-poll */}
            <div className="flex items-center">
                <div className="flex justify-between items-center mr-5"></div>

                {/* wrap-poll */}
                <div className="mx-auto flex px-4 justify-center">
                    {/* poll-grid */}

                    <div className="gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        <form onSubmit={handleSubmit}>
                            <div
                                className="box-content bg-white/50 backdrop-blur-md rounded-[30px] p-6
              flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out h-full 
              hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
                            >

                                {/* Relation */}
                                <div className="relative w-full">
                                    <select
                                        value={categoryRelation}
                                        onChange={(e) => setCategoryRelation(e.target.value)}
                                        required
                                        className={`w-full h-10 rounded-full px-3 pr-10 text-left mt-2.5 text-[14px] font-medium text-gray-700 
                                            appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400
                                            ${getCategoryColor(categoryRelation)} `}
                                    >
                                        <option value="">Select Relation</option>
                                        <option value="family">Family</option>
                                        <option value="friend">Friend</option>
                                        <option value="partner">Partner</option>
                                        <option value="colleague">Colleague</option>
                                        <option value="parent">Parent</option>
                                        <option value="other">Other</option>
                                    </select>

                                    <ChevronDown
                                        className="absolute right-3 top-2/3 -translate-y-2/3 pointer-events-none text-gray-500"
                                        size={16}
                                    />
                                </div>

                                {/* Hobbies */}
                                <div className="relative w-full">
                                    <select
                                        value={categoryHobbies}
                                        onChange={(e) => setCategoryHobbies(e.target.value)}
                                        className={`w-full h-10 rounded-full px-3 pr-10 text-left mt-2.5 text-[14px] font-medium text-gray-700 
                                            appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400
                                            ${getCategoryColor(categoryHobbies)}`}
                                        required
                                    >
                                        <option value="">Select Hobbies</option>
                                        <option value="sports">Sports</option>
                                        <option value="music">Music</option>
                                        <option value="gaming">Gaming</option>
                                        <option value="books">Books</option>
                                        <option value="travel">Travel</option>
                                        <option value="fitness">Fitness</option>
                                        <option value="fashion">Fashion</option>
                                        <option value="photography">Photography</option>
                                        <option value="movies">Movies</option>
                                        <option value="home decor">Home decor</option>
                                        <option value="technology">Technology</option>
                                        <option value="art">Art</option>
                                        <option value="cooking">Cooking</option>
                                    </select>

                                    <ChevronDown
                                        className="absolute right-3 top-2/3 -translate-y-2/3 pointer-events-none text-gray-500"
                                        size={16}
                                    />
                                </div>

                                {/* Gift */}
                                <div className="relative w-full">
                                    <select
                                        value={categoryGift}
                                        onChange={(e) => setCategoryGift(e.target.value)}
                                        className={`w-full h-10 rounded-full px-3 pr-10 text-left mt-2.5 text-[14px] font-medium text-gray-700 
                                            appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400
                                             ${getCategoryColor(categoryGift)}`}
                                        required
                                    >
                                        <option value="">Select Gift Type</option>
                                        <option value="unique">Unique</option>
                                        <option value="practical">Practical</option>
                                        <option value="fun">Fun</option>
                                        <option value="luxury">Luxury</option>
                                        <option value="handmade">Handmade</option>
                                        <option value="personalized">Personalised</option>
                                        <option value="experience">Experience</option>
                                    </select>

                                    <ChevronDown
                                        className="absolute right-3 top-2/3 -translate-y-2/3 pointer-events-none text-gray-500"
                                        size={16}
                                    />
                                </div>

                                <input
                                    id="description"
                                    type="text"
                                    name="description"
                                    placeholder="Your Super Idea Title Here"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="flex text-left  mt-2.5 text-xl text-[#737791] pt-1 pb-1 font-medium"
                                    style={{
                                        width: `${Math.max(5, title.length)}ch`,
                                        minWidth: "25ch",
                                    }}
                                    required
                                />

                                <div className=" flex pt-3">
                                    <button
                                        id="submitButton"
                                        type="submit"
                                        className="justify-center items-center mx-auto w-full h-12 bg-linear-to-r from-[#FF8A5B] to-[#FF6A00] rounded-3xl text-white cursor-pointer mt-3"
                                    >
                                        Create Idea
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
