import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { toast } from "react-toastify";
import { numberWithCommas } from "@/utils/filter";
import { CartData } from "@/types/cartInterfaces";
import { modifyCartApi } from "@/services/cartApis";
import ImageComponent from "../interractivity/image";
import { useCartContext } from "@/contexts/cartContext";
import Link from "next/link";


/**
 * 
 * This very component is rendered on the cart page prior to checkout
 *  
 */

export default function CartItem({
	cartItem,
	updteGrandTotal,
	removeCartItem,
}: {
	cartItem: CartData;
	updteGrandTotal: () => void;
	removeCartItem: (productId: string) => void
}) {
	const productCount = cartItem.product.stock;
	const [count, setCount] = useState(cartItem.quantity);
	const { updateCartCount } = useCartContext();


	const increament = async () => {
		// UI check
		if (productCount != undefined && count < productCount) {
			// network request
			const response = await modifyCartApi({ product_id: cartItem.product.id, action: "increament" })
			if (response.status === 202) {
				updteGrandTotal()
				setCount(count + 1);
				toast.success("cart modified successfully", {
					position: "top-center",
					className: "my-toast",
				});
			} else {
				toast.info("Product not in cart", {
					position: "top-center",
					className: "my-toast",
				});
			}
		} else {
			toast.info("Maximum available product reached", {
				position: "top-center",
				className: "my-toast",
			});
		}
		updateCartCount()
	};


	const decreament = async () => {
		// UI check
		if (productCount != undefined && count > 1) {
			// network request
			const response = await modifyCartApi({ product_id: cartItem.product.id, action: "decreament" })
			if (response.status === 202) {
				updteGrandTotal()
				setCount(count - 1);
				toast.success("cart modified successfully", {
					position: "top-center",
					className: "my-toast",
				});
			} else {
				toast.info("Product not in cart", {
					position: "top-center",
					className: "my-toast",
				});
			}
		} else {
			toast.info("Cannot go below 1 item", {
				position: "top-center",
				className: "my-toast",
			});
		}
		updateCartCount()
	};


	const update = async () => {
		// UI check
		if (productCount != undefined && count > 1) {
			// network request
			const response = await modifyCartApi({ product_id: cartItem.product.id, action: "update" })
			if (response.status === 202) {
				updteGrandTotal()
				setCount(count - 1);
				toast.success("cart modified successfully", {
					position: "top-center",
					className: "my-toast",
				});
			} else {
				toast.info("Product not in cart", {
					position: "top-center",
					className: "my-toast",
				});
			}
		} else {
			toast.info("Cannot go below 1 item", {
				position: "top-center",
				className: "my-toast",
			});
		}
		await updateCartCount()
	};


	const remove = async () => {
		const response = await modifyCartApi({ product_id: cartItem.product.id, action: "remove" })
		if (response.status === 202) {
			removeCartItem(cartItem.product.id);
			updteGrandTotal()
			toast.success("cart item removed successfully", {
				position: "top-center",
				className: "my-toast",
			});
		} else {
			toast.info("Product not in cart", {
				position: "top-center",
				className: "my-toast",
			});
		}
		await updateCartCount()
	}


	return (
		<div className="grid grid-cols-[auto_1fr] gap-4 items-start bg-white rounded-md shadow-md p-3 mb-4">
			{/* Product Image */}
			<div className="w-[8.5rem] h-[7.5rem] relative overflow-hidden rounded-md">
				<Link prefetch href={`/products/${cartItem.product.category}/${cartItem.product.id}`}>
					<ImageComponent src={cartItem.product.image} alt={cartItem.product.name} />
				</Link>
			</div>

			{/* Product Info & Controls */}
			<div className="flex flex-col gap-2 justify-between h-full w-full">
				{/* Product Name and Quantity */}
				<div className="flex justify-between items-start">
					<Link prefetch href={`/products/${cartItem.product.category}/${cartItem.product.id}`}>
						<div className="text-sm font-semibold text-gray-800 leading-snug line-clamp-4">{cartItem.product.name}</div>
					</Link>
					<div className="text-sm font-medium text-gray-600">(x{count})</div>
				</div>

				{/* Price */}
				<div className="text-main-color font-semibold text-base">
					₦ {numberWithCommas(cartItem.product.price)}
				</div>

				{/* Controls */}
				<div className="flex justify-between items-center mt-2">
					{/* Quantity Buttons */}
					<div className="flex items-center border rounded overflow-hidden text-sm">
						<button
							className="bg-main-color text-white px-3 py-1 hover:bg-opacity-90 transition"
							onClick={decreament}
						>
							&minus;
						</button>
						<span className="px-4 ">{count}</span>
						<button
							className="bg-main-color text-white px-3 py-1 hover:bg-opacity-90 transition"
							onClick={increament}
						>
							&#43;
						</button>
					</div>

					{/* Remove Button */}
					<button
						type="button"
						onClick={remove}
						className="text-red-500 hover:text-red-600 transition"
						title="Remove from cart"
					>
						<FontAwesomeIcon icon={faTrash} className="text-[18px]" />
					</button>
				</div>
			</div>
		</div>
	);
}
