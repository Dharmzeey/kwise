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
}

interface ProductWIthQuantity extends Product {
  quantity: number
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


export type { Brand, Product, Category, CartItemInterface, ProductWIthQuantity };
