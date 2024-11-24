'use client';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { Deal } from "@/types/productInterfaces";
import Link from "next/link";
import ImageComponent from "../interractivity/image";

type DealProp = {
	deals: Deal[]
}

export default function CarouselContent(prop: DealProp) {
	return (
		<div>
			<Carousel
				autoPlay
				infiniteLoop
				showStatus={false}
				showThumbs={false}
				interval={5000}
			>
				{
					prop.deals && prop.deals?.length >= 1
						?
						prop.deals.map((deal) =>
						(
							<Link key={deal.id} href={deal.link_to}>
								<div className="relative h-[30svw] w-full md:h-[20svw] border-2 rounded">
									<ImageComponent src={deal.image} alt={deal.title} />
								</div>
							</Link>
						))
						:
						[
							<div key={1} className="relative h-[30svw] w-full md:h-[20svw] border-2 rounded" >
								<Image src="/logo.jpg" alt="kwise logo" fill className="object-cover rounded" />
							</div>
						]
				}
			</Carousel>
		</div>
	);
};

