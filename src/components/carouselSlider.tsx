'use client';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Deal } from "@/types/productInterfaces";
import Link from "next/link";
import { DEALS_URL } from "@/utils/urls/productUrls";

export default function HomeCarousel() {
	const [deals, setDeals] = useState<Deal[] | null>(null);
	useEffect(() => {
		async function fetchDeals() {
			const response = await fetch(DEALS_URL);
			const deals: Deal[] = await response.json();
			if (!response.ok) {
				throw new Error("Failed to fetch products");
			}
			setDeals(deals)
		}
		fetchDeals()
	}, [])
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
					deals && deals?.length >= 1
						?
						<>
							{
								deals.map((deal) =>
								(
									<Link key={deal.id} href={deal.link_to}>
										<div className="relative h-[30svw] w-full md:h-[20svw] border-2 rounded">
											<Image src={deal.image} alt={deal.title} fill className="object-cover rounded" />
										</div>
									</Link>
								))
							}
						</>
						:
						(
							<div className="relative h-[30svw] w-full md:h-[20svw] border-2 rounded">
								<Image src="/logo.jpg" alt="kwise logo" fill className="object-cover rounded" />
							</div>
						)
				}
				<>
					{/* requires a default so I just added that */}
					<div className="relative h-[30svw] w-full md:h-[20svw] border-2 rounded">
						<Image src="/logo.jpg" alt="kwise logo" fill className="object-cover rounded" />
					</div></>
			</Carousel>
		</div>
	);
};

