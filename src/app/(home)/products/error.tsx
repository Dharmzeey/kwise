'use client';
import { useEffect } from "react"

export default function Error({error}: {error: Error}){
    useEffect(()=>{
        console.error(`${error}`)
    }, [error]);
    return (
        <>
        <div className="flex items-center justify-center h-[v-70]" >
            <div className="text-xl text-red-500">There was an error Fetching Products</div>
        </div>
        </>
    )
}