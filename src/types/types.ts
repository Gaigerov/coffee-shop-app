export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}
export interface Order {
    id: string;
    user_id: string;
    total: number;
    status: string;
    created_at: string;
    items?: OrderItem[];
}

export interface OrderItem {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
}

