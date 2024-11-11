'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './image.module.css';

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
            <div className={`${styles.imageWrapper} ${isLoading ? styles.loading : ''}`}>
            <Image
                alt={imageProp.alt}
                src={imageProp.src}
                priority
                // height={imageProp.height}
                // width={imageProp.width}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                onLoad={() => setIsLoading(false)}
                className={`rounded object-cover`}
                />
                </div>
        </>
    )
}
export default ImageComponent;