import React from 'react';
import {Card, CardMedia, CardContent, Typography, Button, Box} from '@mui/material';
import type {Product} from '../../types/types';
import {useAppSelector, useAppDispatch} from '../../store';
import {addItem, updateQuantity, removeItem} from '../../features/cart/cartSlice';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({product}) => {
    const dispatch = useAppDispatch();
    const {items} = useAppSelector((state) => state.cart);
    const cartItem = items.find(item => item.id === product.id);

    const handleAddToCart = () => {
        dispatch(addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            imageUrl: product.image_url || '/assets/images/NoImage.svg'
        }));
    };

    const handleIncrease = () => {
        dispatch(updateQuantity({
            id: product.id,
            quantity: (cartItem?.quantity || 0) + 1
        }));
    };

    const handleDecrease = () => {
        const currentQuantity = cartItem?.quantity || 0;
        if (currentQuantity <= 1) {
            dispatch(removeItem(product.id));
        } else {
            dispatch(updateQuantity({
                id: product.id,
                quantity: currentQuantity - 1
            }));
        }
    };

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
            }
        }}>
            <CardMedia
                component="img"
                height="200"
                image={product.image_url || 'https://via.placeholder.com/300'}
                alt={product.name}
                sx={{
                    objectFit: 'cover',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                }}
            />
            <CardContent sx={{flexGrow: 1}}>
                <Typography gutterBottom variant="h6" component="div" sx={{fontWeight: 600}}>
                    {product.name}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {product.description || 'Описание отсутствует'}
                </Typography>
                <Typography
                    variant="h6"
                    color="pomegranate"
                    sx={{
                        mt: 'auto',
                        fontWeight: 700,
                        fontSize: '1.25rem'
                    }}
                >
                    {product.price.toFixed(2)} ₽
                </Typography>
            </CardContent>

            <Box sx={{p: 2}}>
                {cartItem ? (
                    <div className={styles.counter}>
                        <button
                            className={styles.counterButton}
                            onClick={handleDecrease}
                            aria-label="Уменьшить количество"
                        >
                            -
                        </button>
                        <span className={styles.counterValue}>{cartItem.quantity}</span>
                        <button
                            className={styles.counterButton}
                            onClick={handleIncrease}
                            aria-label="Увеличить количество"
                        >
                            +
                        </button>
                    </div>
                ) : (
                    <Button
                        color="pomegranate"
                        variant="contained"
                        fullWidth
                        onClick={handleAddToCart}
                        sx={{
                            py: 1.5,
                            fontWeight: 600,
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '1rem'
                        }}
                    >
                        Добавить в корзину
                    </Button>
                )}
            </Box>
        </Card>
    );
};
