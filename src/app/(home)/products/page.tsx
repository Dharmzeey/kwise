'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Product() {
    const router = useRouter()
    useEffect(() => {        
        router.push("/")
    },[router])

}