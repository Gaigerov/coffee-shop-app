import {supabase} from '../utils/supabaseClient';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    origin: string;
    roast_level: 'light' | 'medium' | 'dark';
    flavor_notes: string[];
    image_url: string;
    stock: number;
    category: string;
}

export const ProductService = {
  async fetchProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },
};

