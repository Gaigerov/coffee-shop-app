import {ProductsList} from '../features/products/ProductsList';
import {useAppDispatch} from '../store';
import {addItem} from '../features/cart/cartSlice';
import Typography from '@mui/material/Typography';
import type {Product} from '../types/types';

const Menu = () => {
    const dispatch = useAppDispatch();

    const handleAddToCart = (product: Product) => {
        console.log("Adding to cart:", product);

        dispatch(addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            imageUrl: product.image_url
        }));
    };

    return (
        <div>
            <Typography variant="h4" component="h1" sx={{textAlign: 'center', py: 4}}>
                Меню кофейни
            </Typography>
            <ProductsList onAddToCart={handleAddToCart} />
        </div>
    );
};

export default Menu;
