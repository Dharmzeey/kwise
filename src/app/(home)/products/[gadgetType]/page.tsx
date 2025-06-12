import ProductClient from "@/components/products/ProductItems";
import ProductNotFound from "@/components/products/productNotFound";
import {
    fetchProductBrands,
    fetchProductsByBrand,
    fetchProductsByCategory,
} from "@/services/productApi";
import { Metadata } from "next";

type Props = {
    params: Promise<{
        gadgetType: string;
    }>;
    searchParams: Promise<{
        brandName?: string;
    }>;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const { gadgetType } = await props.params;
    const brands = await fetchProductBrands(gadgetType);
    if (!brands || brands.length === 0) {
        return {
            title: "Kwise world",
        };
    }
    const brandNames = brands.map((brand) => brand.name).join(", ");
    return {
        title: `${gadgetType} | Kwise World`,
        description: `Explore our selection of ${gadgetType} including brands such as ${brandNames}. Find the best options at Kwise World.`,
    };
};

export default async function DevicePage({ params, searchParams }: Props) {
    const { gadgetType } = await params;
    const { brandName } = await searchParams;

    const brands = await fetchProductBrands(gadgetType);
    const products = brandName
        ? await fetchProductsByBrand(gadgetType, brandName)
        : await fetchProductsByCategory(gadgetType);

    if (brands.length >= 1 && products.length > 1) {
        return (
            <ProductClient
                gadgetType={gadgetType}
                brands={brands}
                products={products}
            />
        );
    }

    return <ProductNotFound />;
}