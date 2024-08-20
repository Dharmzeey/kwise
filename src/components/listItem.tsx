import Image from "next/image";
import { Product } from "@/utils/productInterface";
import { numberWithCommas } from "@/utils/filter";

export default function ListItems(
  { device }: {
    device: Product
  }
) {
  return (<>
    <div className="rounded shadow-sm shadow-gray-300">
      <div className="w-[9.9rem] h-40 relative">
        <Image
          src={device.image}
          alt={device.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded object-cover"
        />
      </div>
      <div className="pl-1" >
        <div>{device.name}</div>
        <div className="text-main-color text-sm">₦ {numberWithCommas(device.price)}</div>
      </div>
    </div>
  </>)
}