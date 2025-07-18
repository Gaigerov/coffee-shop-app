import {useEffect, useState} from 'react';
import {supabase} from '../utils/supabaseClient';
import type {Product} from '../types/types';


export function useFetchProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const {data, error} = await supabase
                    .from('products')
                    .select('*')
                    .order('price', {ascending: true});

                if (error) {
                    throw new Error(error.message);
                }
                setProducts(data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return {products, loading, error};
}
