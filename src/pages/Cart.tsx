import React from 'react';
import {useAppSelector, useAppDispatch} from '../store';
import {removeItem, updateQuantity, clearCart} from '../features/cart/cartSlice';
import Button from '../components/ui/Button';
import styles from './ Cart.module.scss';
import {useNavigate} from 'react-router-dom';
import Typography from '@mui/material/Typography';

const Cart: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {items} = useAppSelector((state) => state.cart);
    const {user} = useAppSelector((state) => state.auth);

    const handleCheckout = () => {
        if (!user) {
            alert('Для оформления заказа необходимо войти в систему');
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };
    const handleRemoveItem = (id: string) => {
        dispatch(removeItem(id));
    };

    const handleQuantityChange = (id: string, quantity: number) => {
        if (quantity < 1) {
            dispatch(removeItem(id));
        } else {
            dispatch(updateQuantity({id, quantity}));
        }
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className={styles.cart}>
            <Typography variant="h4" component="h1" className={styles.cart__title}>
                Ваша корзина
            </Typography>

            {items.length === 0 ? (
                <div className={styles.cart__empty}>
                    <p>Ваша корзина пуста</p>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/menu')}
                    >
                        Перейти в меню
                    </Button>
                </div>
            ) : (
                <>
                    <div className={styles.cart__items}>
                        {items.map((item) => (
                            <div key={item.id} className={styles.cart__item}>
                                {item.imageUrl && (
                                    <div className={styles.cart__itemImage}>
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className={styles.cart__image}
                                        />
                                    </div>
                                )}

                                <div className={styles.cart__itemInfo}>
                                    <Typography variant="h6" className={styles.cart__itemName}>
                                        {item.name}
                                    </Typography>
                                    <Typography className={styles.cart__itemPrice}>
                                        {item.price.toFixed(2)} ₽
                                    </Typography>
                                </div>

                                <div className={styles.cart__itemControls}>
                                    <div className={styles.cart__quantity}>
                                        <button
                                            className={styles.cart__quantityButton}
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span className={styles.cart__quantityValue}>{item.quantity}</span>
                                        <button
                                            className={styles.cart__quantityButton}
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        onClick={() => handleRemoveItem(item.id)}
                                        className={styles.cart__removeButton}
                                    >
                                        Удалить
                                    </Button>
                                </div>

                                <div className={styles.cart__itemTotal}>
                                    {(item.price * item.quantity).toFixed(2)} ₽
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.cart__summary}>
                        <div className={styles.cart__total}>
                            <Typography>Итого:</Typography>
                            <Typography className={styles.cart__totalAmount}>
                                {total.toFixed(2)} ₽
                            </Typography>
                        </div>

                        <div className={styles.cart__actions}>
                            <Button
                                variant="secondary"
                                onClick={() => dispatch(clearCart())}
                            >
                                Очистить корзину
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleCheckout}
                                className={styles.cart__checkoutButton}
                            >
                                Оформить заказ
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
