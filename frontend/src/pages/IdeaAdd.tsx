import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import { colors } from "../utils/colors";
import { ideaSchema, type IdeaFormErrors } from "../schemas/IdeaSchema";
import { CaretDownIcon } from "@phosphor-icons/react";

export default function AddIdea() {
    const [ideaData, setIdeaData] = useState({
        name: "",
        categoryRelation: "",
        categoryHobbies: "",
        categoryGift: "",
    });

    const [errors, setErrors] = useState<IdeaFormErrors>({});

    const navigate = useNavigate();

    const getCategoryColor = (category?: string) => {
        if (!category) return "bg-gray-200 border-gray-400";

        return (
            colors.find((color) => color.name === category.toLowerCase())
                ?.backgroundColor ?? "bg-gray-200 border-gray-400"
        );
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); 

        const result = ideaSchema.safeParse({
            name: ideaData.name,
            categoryRelation: ideaData.categoryRelation,
            categoryHobbies: ideaData.categoryHobbies,
            categoryGift: ideaData.categoryGift,
        })

        if (!result.success) {
            const fieldErrors: IdeaFormErrors = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof IdeaFormErrors;
                if (!fieldErrors[field]) fieldErrors[field] = issue.message;
            }

            setErrors(fieldErrors);
            return false;
        }

        setErrors({});

        try {
            const response = await authFetch(`${API_URL}/ideas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: ideaData.name,
                    category: [ideaData.categoryRelation, ideaData.categoryHobbies, ideaData.categoryGift],
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data?.detail || "Error to add idea");
                console.error("Error to add idea:", data);
                return;
            }

            console.log("Idea created successfully:", data);
            toast.success("Idea created successfully!", {
                duration: 2000,
            });

            setTimeout(() => {
                navigate("/my-ideas");
            }, 1000);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Error to add idea:", error);
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
                                        value={ideaData.categoryRelation}
                                        onChange={(e) => setIdeaData({ ...ideaData, categoryRelation: e.target.value })}
                                        required
                                        className={`w-full h-10 rounded-full px-3 pr-10 text-left mt-2.5 text-[14px] font-medium text-gray-700 
                                            appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400
                                            ${getCategoryColor(ideaData.categoryRelation)} 
                                            ${errors.categoryRelation ? "border-red-400" : "border-[#737791]"}`}
                                    >
                                        <option value="">Select Relation</option>
                                        <option value="family">Family</option>
                                        <option value="friend">Friend</option>
                                        <option value="partner">Partner</option>
                                        <option value="colleague">Colleague</option>
                                        <option value="parent">Parent</option>
                                        <option value="other">Other</option>
                                    </select>

                                    <CaretDownIcon
                                        className="absolute right-3 top-2/3 -translate-y-2/3 pointer-events-none text-gray-500"
                                        size={16}
                                    />
                                    {errors.categoryRelation && (
                                        <span className="text-red-500 text-xs mt-1">{errors.categoryRelation}</span>
                                    )}
                                </div>

                                {/* Hobbies */}
                                <div className="relative w-full">
                                    <select
                                        value={ideaData.categoryHobbies}
                                        onChange={(e) => setIdeaData({ ...ideaData, categoryHobbies: e.target.value })}
                                        className={`w-full h-10 rounded-full px-3 pr-10 text-left mt-2.5 text-[14px] font-medium text-gray-700 
                                            appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400
                                            ${getCategoryColor(ideaData.categoryHobbies)}
                                            ${errors.categoryHobbies ? "border-red-400" : "border-[#737791]"}`}
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

                                    <CaretDownIcon
                                        className="absolute right-3 top-2/3 -translate-y-2/3 pointer-events-none text-gray-500"
                                        size={16}
                                    />
                                    {errors.categoryHobbies && (
                                        <span className="text-red-500 text-xs mt-1">{errors.categoryHobbies}</span>
                                    )}
                                </div>

                                {/* Gift */}
                                <div className="relative w-full">
                                    <select
                                        value={ideaData.categoryGift}
                                        onChange={(e) => setIdeaData({ ...ideaData, categoryGift: e.target.value })}
                                        className={`w-full h-10 rounded-full px-3 pr-10 text-left mt-2.5 text-[14px] font-medium text-gray-700 
                                            appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400
                                             ${getCategoryColor(ideaData.categoryGift)}
                                             ${errors.categoryGift ? "border-red-400" : "border-[#737791]"}`}
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

                                    <CaretDownIcon
                                        className="absolute right-3 top-2/3 -translate-y-2/3 pointer-events-none text-gray-500"
                                        size={16}
                                    />
                                    {errors.categoryGift && (
                                        <span className="text-red-500 text-xs mt-1">{errors.categoryGift}</span>
                                    )}
                                </div>

                                <input
                                    id="description"
                                    type="text"
                                    name="description"
                                    placeholder="Your Super Idea Title Here"
                                    value={ideaData.name}
                                    onChange={(e) => setIdeaData({ ...ideaData, name: e.target.value })}
                                    style={{
                                        width: `${Math.max(5, ideaData.name.length)}ch`,
                                        minWidth: "25ch",
                                    }}
                                    required
                                    className={`flex text-left  mt-2.5 text-xl text-[#737791] pt-1 pb-1 font-medium
                                              ${errors.name ? "border-b border-red-400" : "border-[#737791]"}`}
                                />
                                {errors.name && (
                                    <span className="text-red-500 text-xs mt-1">{errors.name}</span>
                                )}

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
