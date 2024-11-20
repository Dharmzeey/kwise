"use client";
import { useCartContext } from "@/contexts/cartContext";
import { addToCartApi} from "@/services/cartApis";
import { Product } from "@/types/productInterfaces";
import { useState } from "react";
import { toast } from "react-toastify";

/**
 * 
 * This very component is rendered on the product details page
 *  
 */

const IncreamentDecreamentCheck = ({ product }: { product: Product }) => {
	const productCount = product.stock;
	const [count, setCount] = useState(1);
	const { updateCartCount } = useCartContext();


	const increament = async () => {
		// UI check
		if (productCount != undefined && count < productCount) {
			setCount(count + 1);
		} else {
			toast.info("Maximum available product reached", {
				position: "top-center",
				className: "my-toast",
			});
		}
	};


	const decreament = async () => {
		// UI check
		if (productCount != undefined && count > 1) {
			setCount(count - 1);	
		} else {
			toast.info("Cannot go below 1 item", {
				position: "top-center",
				className: "my-toast",
			});
		}
	};


	const add = async () => {
		const response = await addToCartApi({ product_id: product.id, action: "update", quantity: count })
		if (response.status === 202) {
			toast.success("item added successfully", {
				position: "top-center",
				className: "my-toast",
			});
		}
		updateCartCount()
		setCount(1)
	}


	return (
		<>
			<div className="flex justify-between items-center mt-3 lg:flex-col gap-3 lg:w-full">
				<div className="flex items-center shadow md:w-full md:justify-between rounded">
					<button
						className="p-2 bg-main-color text-white text-2xl rounded-l"
						onClick={decreament}
					>
						&minus;
					</button>
					<span className="px-6 py-2 ">{count}</span>
					<button
						className="p-2 bg-main-color text-white text-2xl rounded-r"
						onClick={increament}
					>
						&#43;
					</button>
				</div>
				<div className="self-start shadow rounded md:self-auto w-full">
					<button className="p-[14px] bg-main-color text-white text-sm text-bold uppercase rounded w-full" onClick={add}>
						Add to cart
					</button>
				</div>
			</div>
		</>
	);
};

export default IncreamentDecreamentCheck;
