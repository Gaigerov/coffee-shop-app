import {Card, CardMedia, CardContent, Typography, Button} from '@mui/material';
import type {Product} from '../../types/types';


interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({product, onAddToCart}) => {
    const handleAdd = () => {
        console.log("Adding product:", product);
        onAddToCart(product);
    };

    return (
        <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <CardMedia
                component="img"
                height="200"
                image={product.image_url || 'https://via.placeholder.com/300'}
                alt={product.name}
                sx={{objectFit: 'cover'}}
            />
            <CardContent sx={{flexGrow: 1}}>
                <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                    {product.description || 'Описание отсутствует'}
                </Typography>
                <Typography variant="h6" color="pomegranate" sx={{mt: 'auto'}}>
                    {product.price.toFixed(2)} ₽
                </Typography>
            </CardContent>
            <Button
                color="pomegranate"
                variant="contained"
                fullWidth
                onClick={handleAdd}
                sx={{mt: 'auto'}}
            >
                Добавить в корзину
            </Button>
        </Card>
    );
};
