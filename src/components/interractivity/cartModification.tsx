'use client'
import { Product } from "@/utils/productInterface";
import { useState } from "react";
import { toast } from "react-toastify";

const IncreamentDecreamentCheck = (
    { product }:
        {
            product: Product
        }
) => {

    const productCount = product.stock;
    const [count, setCount] = useState(1)

    const increament = () => {
        if (productCount != undefined && count < productCount) {
            setCount(count + 1)
        } else {
            toast.info("Maximum available product reached", {
                position: "top-center",
                className: "my-toast",
            });
        }
    }
    const decreament = () => {
        if (productCount != undefined && count > 1) {
            setCount(count - 1)
        } else {
            toast.info("Cannot go below 1 item", {
                position: "top-center",
                className: "my-toast",
            });
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mt-3">
                <div className="flex items-center shadow ">
                    <button className="px-2 bg-main-color text-white text-2xl rounded-l" onClick={decreament} >&minus;</button>
                    <span className="px-6 py-2 ">{count}</span>
                    <button className="px-2 bg-main-color text-white text-2xl rounded-r" onClick={increament}  >&#43;</button>
                </div>
                <div className="self-start shadow rounded">
                    <button className="px-3 py-2 bg-main-color text-white text-sm text-bold uppercase rounded" >Add to cart</button>
                </div>
            </div>
        </>
    )

}

export default IncreamentDecreamentCheck;

