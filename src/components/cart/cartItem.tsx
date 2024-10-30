import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { numberWithCommas } from "@/utils/filter";
import { CartData } from "@/types/cartInterfaces";
import { modifyCartApi } from "@/services/cartApis";

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


	const increament = async () => {
		// UI check
		if (productCount != undefined && count < productCount) {
			// network request
			const response = await modifyCartApi({ product_id: cartItem.product.id, action: "increament" })
			if (response.status === 202) {
				updteGrandTotal()
				setCount(count + 1);
				alert("cart modified successfully")
			} else {
				alert("Product not in cart")
			}
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
			// network request
			const response = await modifyCartApi({ product_id: cartItem.product.id, action: "decreament" })
			if (response.status === 202) {
				updteGrandTotal()
				setCount(count - 1);
				alert("cart modified successfully")
			} else {
				alert("Product not in cart")
			}
		} else {
			toast.info("Cannot go below 1 item", {
				position: "top-center",
				className: "my-toast",
			});
		}
	};


	const update = async () => {
		// UI check
		if (productCount != undefined && count > 1) {
			// network request
			const response = await modifyCartApi({ product_id: cartItem.product.id, action: "update" })
			if (response.status === 202) {
				updteGrandTotal()
				setCount(count - 1);
				alert("cart modified successfully")
			} else {
				alert("Product not in cart")
			}
		} else {
			toast.info("Cannot go below 1 item", {
				position: "top-center",
				className: "my-toast",
			});
		}
	};


	const remove = async () => {
		const response = await modifyCartApi({ product_id: cartItem.product.id, action: "remove" })
		if (response.status === 202) {
			removeCartItem(cartItem.product.id);
			updteGrandTotal()
			alert("cart item removed successfully")
		} else {
			alert("Product not in cart")
		}
	}


	return (
		<>
			<div className="grid grid-cols-[auto_1fr] mb-3 shadow">
				<div className="w-[8.5rem] h-[8.5rem] relative">
					<Image
						src={cartItem.product.image}
						alt={cartItem.product.name}
						fill
						className="rounded object-cover"
					/>
				</div>
				<div className="ml-2 pt-1 pr-1 flex flex-col gap-2">
					<div className="flex justify-between">
						<div>{cartItem.product.name}</div>
						<b>(x{count})</b>
					</div>
					<div>₦ {numberWithCommas(cartItem.product.price)}</div>
					<div className="flex justify-between">
						<div className="flex items-center shadow rounded">
							<button
								className="px-2 bg-main-color text-white text-sm rounded-l"
								onClick={decreament}
							>
								&minus;
							</button>
							<span className="px-3">{count}</span>
							<button
								className="px-2 bg-main-color text-white text-sm rounded-r"
								onClick={increament}
							>
								&#43;
							</button>
						</div>
						{/* <div className="self-start shadow rounded">
							<button className="px-2 bg-main-color text-white text-sm text-bold uppercase rounded"
								onClick={update}
							>
								Update
							</button>
						</div> */}
						<div>
							<button type="button" onClick={remove}>
								<FontAwesomeIcon
									icon={faTrash}
									className="text-main-color text-[18px]"
								/>
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}