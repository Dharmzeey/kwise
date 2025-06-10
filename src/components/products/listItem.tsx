import { Product } from "@/types/productInterfaces";
import { numberWithCommas } from "@/utils/filter";
import ImageComponent from "../interractivity/image";

export default function ListItems({ device }: { device: Product }) {
    return (
        <div className="group rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col">

            {/* Product Image */}
            <div className="relative w-full h-[22svw] md:h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                <ImageComponent
                    src={device.image}
                    alt={device.name}
                // className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Product Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2 min-h-[3rem]">
                        {device.name}
                    </h3>
                </div>

                <div className="mt-2">
                    <span className="text-main-color font-bold text-lg">
                        ₦{numberWithCommas(device.price)}
                    </span>
                </div>

                {/* Optional: Add a button or quick view link */}
                <div className="mt-3">
                    <button className="w-full py-2 px-4 bg-main-color text-white text-sm font-medium rounded-md hover:bg-opacity-90 transition-colors duration-200">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}