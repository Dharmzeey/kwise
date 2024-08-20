'use client';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

export default function HomeCarousel() {
  return (
    <div>
      <Carousel
       autoPlay
       infiniteLoop
       showStatus={false}
       showThumbs={false}
       interval={5000}
      >
        <div className="relative w-72 h-36 border-2 rounded">
          <Image src="/images/slider/i1.jpg" alt="iphone"  fill className="object-cover rounded" />
        </div>
        <div className="relative w-72 h-36 border-2 rounded">
          <Image src="/images/slider/i2.jpg" alt="iphone"  fill className="object-cover rounded" />
        </div>
        <div className="relative w-72 h-36 border-2 rounded">
          <Image src="/images/slider/i3.jpg" alt="iphone"  fill className="object-cover rounded" />
        </div>
        <div className="relative w-72 h-36 border-2 rounded">
          <Image src="/images/slider/m1.jpg" alt="macbook"  fill className="object-cover rounded" />
        </div>

      </Carousel>
    </div>
  );
};

