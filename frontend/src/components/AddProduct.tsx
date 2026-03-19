import { useState } from "react";
import { API_URL } from "../config";
import { authFetch } from "../utils/auth";
import StarRating from "./Stars";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

interface ProductProps {
    getProducts?: () => Promise<void>;
}

export default function AddProductCard({ getProducts }: ProductProps) {
    const { uuid } = useParams<{ uuid: string }>();
    const [productData, setProductData] = useState({
        title: "",
        link: "",
        image: "",
        rating: "",
        price: "",
    });

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // prevent refreshing page
        try {
            const response = await authFetch(
                `${API_URL}/polls/${uuid}/products/custom`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: productData.title,
                        link: productData.link,
                        image: productData.image,
                        rating: productData.rating,
                        price: productData.price,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Error to add product:", data);
                toast.error("Error to add product");
                return;
            }

            console.log("Product added successfully:", data);
            toast.success("Product added successfully!", {
                duration: 2000,
            });

            setProductData({
                title: "",
                link: "",
                image: "",
                rating: "",
                price: "",
            });

            if (getProducts) await getProducts();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Error to add product: ${error.message}`);
                console.error(`Error to add product: ${error.message}`);
            } else {
                toast.error("Error to add product!");
                console.error("Error to add product!", error);
            }
        }
    }

    return (
        <>
            {/* wrap-product */}
            <div className="mx-auto flex justify-center">
                {/* product-container */}
                <div className="grid gap-6 w-full max-w-200 my-10 mx-auto grid-cols-1">
                    <div className="mb-4">
                        {/* card-product */}
                        <form onSubmit={handleSubmit}>
                            <div
                                className="relative 
                                bg-white/[0.841]
                                max-w-200 backdrop-blur-[10px] rounded-[30px] p-6 
                                flex shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)] 
                                transition-all duration-250 ease-in-out gap-3 
                                hover:-translate-y-1 
                                hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
                            >
                                {/* product-image-container */}
                                <div className="w-50 max-h-57.5 aspect-square rounded-xl overflow-hidden shrink-0 hover:text-[#0096FF] ">
                                    <div
                                        className="h-full  bg-white/[0.439] backdrop-blur-[10px] border-2 border-dashed 
                                            border-[#cbd5f5] rounded-[30px] p-6 flex flex-col items-center justify-center cursor-pointer
                                            transition-all duration-250 hover:border-[#F25E0D] hover:bg-[rgba(246,143,92,0.05)]"
                                    // onClick={() => navigate("/add-poll")}
                                    >
                                        {/* create-icon */}
                                        <div className="w-14 h-14 flex items-center justify-center mb-4">
                                            <svg
                                                className="w-7 h-7 text-[#9496b8]"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                        </div>

                                        {/* IMG URL */}
                                        <input
                                            id="image url"
                                            type="text"
                                            name="image"
                                            className="text-black mb-1 text-sm text-center h-8"
                                            placeholder="Add Image URL"
                                            value={productData.image}
                                            onChange={(e) => {
                                                setProductData({
                                                    ...productData,
                                                    image: e.target.value,
                                                });
                                            }}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* product-text */}
                                <div className="flex flex-col pl-5 text-left flex-1">
                                    {/* product-title-price */}
                                    <div className="flex justify-between items-start gap-5">
                                        <div className="flex text-sm text-[#555] gap-2.5 items-center">
                                            <div className="flex items-center text-[#737791] opacity-40">
                                                <StarRating rating={5} />
                                            </div>
                                            <div className="text-[#737791]">
                                                <input
                                                    id="rating"
                                                    type="text"
                                                    name="rating"
                                                    className="text-black text-sm "
                                                    placeholder="4.5"
                                                    value={productData.rating}
                                                    onChange={(e) => {
                                                        setProductData({
                                                            ...productData,
                                                            rating: e.target.value,
                                                        });
                                                    }}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="text-2xl font-extrabold text-[#737791] mb-2 flex">
                                            <span className="opacity-40">$</span>

                                            <input
                                                id="price"
                                                type="text"
                                                name="price"
                                                className="text-black"
                                                placeholder="32.99"
                                                value={productData.price}
                                                onChange={(e) => {
                                                    setProductData({
                                                        ...productData,
                                                        price: e.target.value,
                                                    });
                                                }}
                                                style={{
                                                    width: `${Math.max(5, productData.price.length)}ch`,
                                                    minWidth: "5ch",
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* product-title */}
                                    <div className="group relative font-semibold text-[0.9rem] leading-[1.4] hover:text-[#0096FF] hover:cursor-pointer">
                                        <input
                                            id="title"
                                            type="text"
                                            name="title"
                                            className="text-black w-full h-8"
                                            placeholder="Product Title Here"
                                            value={productData.title}
                                            onChange={(e) => {
                                                setProductData({
                                                    ...productData,
                                                    title: e.target.value,
                                                });
                                            }}
                                            required
                                        />
                                    </div>

                                    {/* product-link */}
                                    <div className="group relative font-semibold text-[0.9rem] leading-[1.4] hover:text-[#0096FF] hover:cursor-pointer ">
                                        <input
                                            id="url"
                                            type="text"
                                            name="url"
                                            className="text-black mt-3 w-full h-8"
                                            placeholder="Product URL Here"
                                            value={productData.link}
                                            onChange={(e) => {
                                                setProductData({
                                                    ...productData,
                                                    link: e.target.value,
                                                });
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-2 mt-auto">
                                        <button
                                            onClick={() =>
                                                setProductData({
                                                    title: "",
                                                    link: "",
                                                    image: "",
                                                    rating: "",
                                                    price: "",
                                                })
                                            }
                                            className="flex-1 border  rounded-full px-6 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors hover:cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            id="submitButton"
                                            type="submit"
                                            className="flex-1  text-white rounded-full px-6 py-2  bg-[#6366f1] hover:bg-[#4F46E5]  hover:text-white transition-colors hover:cursor-pointer"
                                        >
                                            Add Product
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
