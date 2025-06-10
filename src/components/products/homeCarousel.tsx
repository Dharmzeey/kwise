"use client";

import { useEffect, useState } from "react";
import { Deal } from "@/types/productInterfaces";
import { DEALS_URL } from "@/utils/urls/productUrls";
import CarouselContent from "./carouselContent";

export default function HomeCarousel() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const response = await fetch(DEALS_URL);
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data: Deal[] = await response.json();
                setDeals(data);
            } catch (err: any) {
                setError(err.message);
            }
        };
        fetchDeals();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return <CarouselContent deals={deals} />;
}