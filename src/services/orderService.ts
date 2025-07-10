import {supabase} from '../utils/supabaseClient';

export interface OrderItem {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    user_id: string;
    items: OrderItem[];
    total: number;
    bonus_points_used: number; // Изменено с ? на обязательное
    status: 'pending' | 'completed' | 'cancelled';
    created_at: string;
}

export const OrderService = {
    async createOrder(
        userId: string,
        items: OrderItem[],
        total: number,
        bonusPointsUsed: number = 0,
        status: 'pending' | 'completed' | 'cancelled' = 'pending'
    ): Promise<Order> {
        const {data, error} = await supabase
            .from('orders')
            .insert([
                {
                    user_id: userId,
                    items,
                    total,
                    bonus_points_used: bonusPointsUsed, 
                    status
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating order:', error);
            throw new Error(error.message);
        }
        return data as Order;
    }
};
