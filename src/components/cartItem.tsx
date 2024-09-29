import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { ProductWIthQuantity } from "@/types/productInterfaces";
import { numberWithCommas } from "@/utils/filter";

export default function CartItem({
  product,
}: {
  product: ProductWIthQuantity;
}) {
  const productCount = product?.stock;
  const [count, setCount] = useState(1);

  const increament = () => {
    if (productCount != undefined && count < productCount) {
      setCount(count + 1);
    } else {
      toast.info("Maximum available product reached", {
        position: "top-center",
        className: "my-toast",
      });
    }
  };
  const decreament = () => {
    if (productCount != undefined && count > 1) {
      setCount(count - 1);
    } else {
      toast.info("Cannot go below 1 item", {
        position: "top-center",
        className: "my-toast",
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-[auto_1fr] mb-2 shadow">
        <div className="w-[8.5rem] h-[8.5rem] relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="rounded object-cover"
          />
        </div>
        <div className="ml-2 pt-1 pr-1 flex flex-col gap-2">
          <div className="flex justify-between">
            <div>{product.name}</div>
            <b>(x{product.quantity})</b>
          </div>
          <div>₦ {numberWithCommas(product.price)}</div>
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
            <div className="self-start shadow rounded">
              <button className="px-2 bg-main-color text-white text-sm text-bold uppercase rounded">
                Update
              </button>
            </div>
            <div>
              <button type="button">
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
