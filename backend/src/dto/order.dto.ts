export interface CreateOrderDto {
    payment: 'card' | 'online';
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface OrderResponse {
    id: string;
    total: number;
}

export interface ProductForOrder {
    _id: string;
    price: number | null;
    title: string;
}
