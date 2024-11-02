'use client';
import Header from "@/components/header";
import { CartProvider } from "./cartContext";


export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <CartProvider>
            {children}
        </CartProvider>
    );
}