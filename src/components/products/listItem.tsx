import { Product } from "@/types/productInterfaces";
import { numberWithCommas } from "@/utils/filter";
import ImageComponent from "../interractivity/image";

export default function ListItems({ device }: { device: Product }) {
  return (
    <>
      <div className="rounded shadow-sm shadow-gray-300">
        <div className="w-[9.9rem] h-40 relative">
          <ImageComponent src={device.image} alt={device.name} />
        </div>
        <div className="p-1 pt-2">
          <div>{device.name}</div>
          <div className="text-main-color text-sm">
            ₦ {numberWithCommas(device.price)}
          </div>
        </div>
      </div>
    </>
  );
}
