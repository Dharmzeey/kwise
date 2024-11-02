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
		console.log(response)
		if (response.status === 202) {
			alert("item added successfully")
		}
		updateCartCount()
		setCount(1)
	}


	return (
		<>
			<div className="flex justify-between items-center mt-3">
				<div className="flex items-center shadow ">
					<button
						className="px-2 bg-main-color text-white text-2xl rounded-l"
						onClick={decreament}
					>
						&minus;
					</button>
					<span className="px-6 py-2 ">{count}</span>
					<button
						className="px-2 bg-main-color text-white text-2xl rounded-r"
						onClick={increament}
					>
						&#43;
					</button>
				</div>
				<div className="self-start shadow rounded">
					<button className="px-3 py-2 bg-main-color text-white text-sm text-bold uppercase rounded" onClick={add}>
						Add to cart
					</button>
				</div>
			</div>
		</>
	);
};

export default IncreamentDecreamentCheck;
