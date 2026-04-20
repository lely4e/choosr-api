import { useState, useEffect, useRef } from "react";
import { authFetch } from "../utils/auth";
import { API_URL } from "../config";
import toast from "react-hot-toast";
import type { Product } from "../utils/types";

export function useProducts(uuid: string | undefined) {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // fetch products
    const getProducts = async (pageNum = 1, append = false) => {
        if (!uuid) return;
        try {
            const response = await authFetch(
                `${API_URL}/polls/${uuid}/products?page=${pageNum}&size=10`,
            );
            const data = await response.json().catch(() => null);

            if (append) {
                setProducts((prev) => [...prev, ...data.items]);
            } else {
                setProducts(data.items);
            }

            setHasMore(data.page < data.pages);
            setPage(pageNum);

            console.log("Products fetched:", data);
            console.log("Amount of products:", data.length);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        if (!uuid) return;
        getProducts(1, false);
    }, [uuid]);

    const loadMore = async () => {
        if (!hasMore || loadingMore) return;
        setLoadingMore(true);
        await getProducts(page + 1, true);
        setLoadingMore(false);
    };

    useEffect(() => {
        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadMore();
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, loadingMore, products]);

    const refreshProducts = async () => {
        if (!uuid) return;
        try {
            const response = await authFetch(
                `${API_URL}/polls/${uuid}/products?page=1&size=${page * 10}`,
            );
            const data = await response.json().catch(() => null);
            setProducts(data.items);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to refresh products!", error);
        }
    };

    return {
        products,
        getProducts,
        setProducts,
        refreshProducts,
        sentinelRef,
        loadingMore,
        hasMore
    };
}