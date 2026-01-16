import { useState } from "react";

import { authFetch } from "../utils/auth";
import type { ProductSearch } from "../utils/types";

export default function Search() {

    const [userInput, setUserInput] = useState("");
    const [searchResults, setSearchResults] = useState<ProductSearch[]>([]);


    const truncate = (text: string, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    const handleSearch = async () => {
        const value = userInput.trim();

        console.log("Searching for:", userInput);
        if (value.length < 2) {
            alert("Please enter at least 2 characters");
            return;
        }

        try {
            const response = await authFetch(
                `http://127.0.0.1:8000/products/search?search=${encodeURIComponent(userInput)}`
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.detail ||
                    data.error ||
                    "Request failed"
                );
                console.error("API error:", data);
                return;
            }

            setSearchResults(data);
            console.log("Search results:", data);
        } catch (error) {
            // alert("Server is unreachable");
            console.error(error);
        };
    };


    return (
        <>
            <h1>Search Page</h1>
            <p>Search for products</p>
            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
            <button onClick={handleSearch}>Search</button>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {searchResults.map((product, index) => (
                    <li key={index} style={{ marginBottom: "16px" }}>
                        <div className="card-product">
                            <img src={product.image} alt={product.title} className="product-image" />
                            <div className="product-text">
                                <div className="product-title">{truncate(product.title, 60)}</div>
                                <div className="product-price">${product.price}</div>
                                <div className="product-rating">⭐ {product.rating}</div>

                                <a href={product.link}>Details</a>
                                <div>
                                    <button>Add to Poll</button>
                                    <button>Save for later</button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

        </>
    );
}