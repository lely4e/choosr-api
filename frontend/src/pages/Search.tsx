import { useEffect, useState } from "react";

import { authFetch } from "../utils/auth";
import type { ProductSearch } from "../utils/types";
import { useNavigate } from "react-router-dom";

export default function Search({ userSearch }: { userSearch?: string }) {

    const [userInput, setUserInput] = useState(userSearch ?? "");
    const [searchResults, setSearchResults] = useState<ProductSearch[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (userSearch) {
            setUserInput(userSearch);
        }
    }, [userSearch]);
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
            <div className="wrap-search">
                <h1 className="login-h1">Search Page</h1>
                <p className="account-prompt">Search for products</p>
                <div className="search-bar">
                    <input id="search" className="search-product" type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Wireless Headphones" />
                    <button onClick={handleSearch}>Search</button>
                </div>


                <div className="wrap-product">
                <div className="product-container">
                    {searchResults.map((product, index) => (
                        <div key={index} style={{ marginBottom: "16px" }}>
                            <div className="card-product">

                                <div className="product-image-container">
                                    <img src={product.image} alt={product.title} className="product-image" />
                                </div>

                                <div className="product-text">
                                    <div className="product-title-price">
                                    <div className="product-title">{truncate(product.title, 60)}</div>
                                    <div className="product-price"> ${product.price}</div>
                                </div>

                                    <div className="product-rating"><div style={{color: '#FF6A00'}}>★★★★★ </div> <strong>{product.rating}</strong> (2,345 reviews)</div>
                                    
                                 
                                    <div>
                                        <button className="add-product-to-poll">Add Product to Poll</button>
                                    </div>
                                    <div className="products-link-comments">
                        
                                        <button onClick={() => navigate(product.link)} className="product-details-button">Details</button>
                                        <button className="product-details-button">Save</button>
                                      

                                    </div>
                                </div>

                            </div>

                        </div>
                    ))}
                </div>
                </div>
            </div>
        </>
    );
}