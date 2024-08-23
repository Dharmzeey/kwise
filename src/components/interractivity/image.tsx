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
    const [isImageLoading, setImageLoading] = useState(true)

    return (
        <Image
            alt={imageProp.alt}
            src={imageProp.src}
            // height={imageProp.height}
            // width={imageProp.width}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setImageLoading(false)}
            className={`${isImageLoading ? 'blur' : 'remove-blur'} rounded object-cover`}
        />
    )
}
export default ImageComponent;