import { useState, useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Layout } from "../components/Search";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";


interface SearchProps {
    layout: Layout;
    showProducts: boolean;
    hasMore: boolean;
    loadingMore: boolean;
    loadMore: () => void;
    searchResults: unknown[];
}

export function useCarousel({
    layout,
    showProducts,
    hasMore,
    loadingMore,
    loadMore,
    searchResults
}: SearchProps) {
    const [slidesToShow, setSlidesToShow] = useState(
        layout === "poll" ? 4 : 2
    );

    useEffect(() => {
        const update = () => {
            if (window.innerWidth < 480) {
                setSlidesToShow(1);
            } else if (window.innerWidth < 768) {
                setSlidesToShow(layout === "poll" ? 2 : 1);
            } else if (window.innerWidth < 1024) {
                setSlidesToShow(layout === "poll" ? 3 : 1);
            } else {
                setSlidesToShow(layout === "poll" ? 4 : 2);
            }
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [layout]);

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            align: "start",
            slidesToScroll: 1,
            dragFree: true,
        },
        [
            WheelGesturesPlugin({
                forceWheelAxis: "x", // horizontal carousel
            }),
        ]
    );

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        onSelect();
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    // Re-init Embla when results change so it picks up new slides
    useEffect(() => {
        emblaApi?.reInit();
    }, [searchResults, emblaApi]);

    // Sentinel element for IntersectionObserver-based infinite loading
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sentinelRef.current || !showProducts) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
        
    }, [showProducts, hasMore, loadingMore, loadMore]);

    return {
        emblaApi,
        canScrollPrev,
        canScrollNext,
        emblaRef,
        slidesToShow,
        sentinelRef,
        layout
    };
}