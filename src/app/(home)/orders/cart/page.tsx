"use client";

import CartItem from "@/components/cartItem";
import { cartItems } from "@/data/cartItems";
import { products } from "@/data/products";
import { CartItemInterface, Product } from "@/types/productInterfaces";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const fetchedProducts: Product[] = products;
  const fetchedCartItems: CartItemInterface[] = cartItems;
  const cartItemIds = fetchedCartItems.map(
    (item) => item.id
  ); /* extracts the id from the cartItem interface */
  const filteredCartItems = fetchedProducts.filter((product) =>
    cartItemIds.includes(product.id)
  );
  const filteredCartItemsWithQuantity = filteredCartItems.map((cartItem) => {
    const item = cartItems.find((i) => i.id === cartItem.id);
    return {
      ...cartItem,
      quantity: item ? item.quantity : 1,
    };
  });
  console.log(filteredCartItems);
  console.log(filteredCartItemsWithQuantity);
  return (
    <>
      <div>
        <h1 className="font-bold text-secondary-gray-color mb-2">
          Cart Information
        </h1>
        <div className="flex justify-between font-bold mb-2">
          <div>Total</div>
          <div>₦ 5,500,00</div>
        </div>
        {/* Cart Item */}
        {filteredCartItemsWithQuantity.map((cartItem) => (
          <CartItem key={cartItem.id} product={cartItem} />
        ))}
      </div>
      <ToastContainer
        limit={1}
        autoClose={2000}
        transition={Slide}
        closeOnClick
      />
    </>
  );
}
