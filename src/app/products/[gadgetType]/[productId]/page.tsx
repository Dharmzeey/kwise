'use client'

import Image from "next/image"
import { Product } from "@/utils/productInterface"
import { numberWithCommas } from "@/utils/filter"
import { useState } from "react"
import { Slide, toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-solid-svg-icons"

export default function ProductDetail(
  { params }: {
    params: {
      productId: string
    }
  }
) {
  const [product, setProduct] = useState<Product>();
  const productCount = product?.stock;
  const [count, setCount] = useState(1)

  async function fetchProduct() {
    const res = await fetch(`http://localhost:8000/v1/products/${params.productId}`);
    const product = await res.json()
    setProduct(product)
  }
  fetchProduct()

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

  return (<>
    {
      product != undefined ?
        <section className="">
          <div className="w-[20.5rem] h-[14.5rem] relative mb-2">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="rounded object-cover" />
          </div>
          <div className="flex justify-between">
            <div className="flex gap-3" >
              <div className={`${product.utilizationStatus == 'Brand New' ? 'brand-new' : 'uk-used'} text-white px-2 p-1 rounded-sm`} >{product.utilizationStatus}</div>
              <div className={`${product.availabilityStatus == 'In Stock' ? 'in-stock' : 'out-of-stock'} text-white px-2 p-1 rounded-sm`} >{product.availabilityStatus}</div>
            </div>
            <div>
              <FontAwesomeIcon icon={faHeart} className="text-2xl " />
            </div>
          </div>
          <div className="py-3" >{product.name}</div>
          <div className="font-bold" >₦{numberWithCommas(product.price)}</div>
          <div className="pb-3" >Description</div>
          <p>{product.description}</p>
          {/* Add to cart */}
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
        </section> :
        <div className="text-3xl">Not found</div>
    }
    <ToastContainer
      limit={1}
      autoClose={2000}
      transition={Slide}
      closeOnClick
    />
  </>
  )
}
