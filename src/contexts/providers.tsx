'use client';
import { AuthProvider } from "./authContext";
import { CartProvider } from "./cartContext";


export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <AuthProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </AuthProvider>
    );
}