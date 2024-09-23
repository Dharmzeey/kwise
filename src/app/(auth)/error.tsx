'use client';
import { useEffect } from "react"

export default function Error({error}: {error: Error}){
    useEffect(()=>{
        console.error(`${error}`)
    }, [error]);
    return (
        <>
        <div className="flex items-center justify-center h-[v-70]" >
            <div className="text-2xl text-red-500">An Error Occured</div>
        </div>
        </>
    )
}