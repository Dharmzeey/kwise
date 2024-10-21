'use client'
import { useRouter } from "next/navigation";

export default function Product() {
    const router = useRouter()
    router.push("/")

}