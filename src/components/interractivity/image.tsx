'use client'

import { useState } from 'react'
import Image from 'next/image'

type ImageProp = {
    alt: string;
    src: string;
    // height: number;
    // width: number;
}

const ImageComponent = (imageProp: ImageProp) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <div className={`imageWrapper ${isLoading ? 'loading' : ''}`}>
                {/* The imageWrapper and loading is imported in the globals.css */}
                <Image
                    alt={imageProp.alt}
                    src={imageProp.src}
                    priority
                    // height={imageProp.height}
                    // width={imageProp.width}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                    onLoad={() => setIsLoading(false)}
                    className={`object-cover transition-transform duration-500 group-hover:scale-105`}
                />
            </div>
        </>
    )
}
export default ImageComponent;