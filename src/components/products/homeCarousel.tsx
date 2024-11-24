import { Deal } from "@/types/productInterfaces";
import { DEALS_URL } from "@/utils/urls/productUrls";
import CarouselContent from "./carouselContent";

export default async function HomeCarousel() {
    const response = await fetch(DEALS_URL);
    const deals: Deal[] = await response.json();
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    return <>
        <CarouselContent deals={deals} />
    </>
}