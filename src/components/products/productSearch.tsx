import Link from "next/link";
import { numberWithCommas } from "@/utils/filter";
import { Product } from "@/utils/productInterface";
import ImageComponent from "../interractivity/image";

export default function ProductSearchCategory(
	{ products, gadgetType }:
		{
			products: Product[],
			gadgetType: string,
		}
) {
	return (<>
		{
			products.length >= 1 ?
				<section className="pb-9">
					<div className="flex justify-between mb-2">
						<div>
							{gadgetType}
						</div>
					</div>
					<div className="border-2 rounded p-5 grid grid-cols-2 gap-3">
						{
							products.map((product) =>
								<Link key={product.id} href={`/products/${product.category}/${product.id}`}>
									<div>
										<div className="w-full h-32 relative">
											<ImageComponent
												src={product.image}
												alt={product.name}
											/>
										</div>
										<div className="pt-2 " >
											{product.name}
										</div>
										<div className=" text-main-color text-sm">₦{numberWithCommas(product.price)}</div>
									</div>
								</Link>
							)
						}
					</div>
				</section>
				:
				<></>
		}
	</>)
}
