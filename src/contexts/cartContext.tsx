import { getCartApi } from '@/services/cartApis';
import React, { createContext, useContext, useEffect, useState } from 'react';


interface CartContextType {
    cartCount: number;
    updateCartCount: () => void;
}


const CartContext = createContext<CartContextType|undefined>(undefined);

export const CartProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [cartCount, setCartCount] = useState(0);
    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const response = await getCartApi();
                if (response.status === 200) {
                    setCartCount(response.data.item_count);
                }
            } catch (error) {
                console.error("Failed to fetch cart count:", error);
            }
        };
        fetchCartCount();
    }, []);

    // Update the cart count when changes are made
    const updateCartCount = async () => {
        try {
            const response = await getCartApi();
            setCartCount(response.data.item_count);
        } catch (error) {
            console.error("Failed to update cart count:", error);
        }
    };

    return (<CartContext.Provider value={{ cartCount: cartCount, updateCartCount: updateCartCount}} >
    { children }
    </CartContext.Provider>
  );
};

// Custom hook for accessing cart context
// export const useCartContext = () => useContext(CartContext);
export function useCartContext() {
    const cart = useContext(CartContext)
    if (cart === undefined) {
        throw new Error('useCartContext must be used with a CartContext');
    }
    return cart;
}

