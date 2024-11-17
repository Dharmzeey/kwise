interface Deal{
  id: string;
  title: string;
  details: string;
  image: string;
  link_to: string;
}


interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  stock: number;
  availabilityStatus: string;
  utilizationStatus: string;
  user_wishlist: boolean;
}

interface Category {
  id: number;
  category: string;
  brand: string
}

interface Brand {
  id: number;
  category: string;
  name: string
}

interface CartItemInterface {
  id: number;
  quantity: number
}


export type { Deal, Brand, Product, Category, CartItemInterface };
