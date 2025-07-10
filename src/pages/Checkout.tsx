import React, {useEffect, useState} from 'react';
import {useAppSelector, useAppDispatch} from '../store';
import {clearCart} from '../features/cart/cartSlice';
import Button from '../components/ui/Button';
import styles from './Checkout.module.scss';
import {useNavigate} from 'react-router-dom';
import {supabase} from '../utils/supabaseClient';
import Typography from '@mui/material/Typography';

const Checkout: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {items} = useAppSelector((state) => state.cart);
    const {user} = useAppSelector((state) => state.auth);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);

        try {
            if (!user) throw new Error('Пользователь не авторизован');

            const orderData = {
                user_id: user.id,
                total,
                items: items.map(item => ({
                    product_id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            };

            const {error: orderError} = await supabase
                .from('orders')
                .insert([orderData]);

            if (orderError) throw orderError;

            // Обновляем бонусные баллы (10 зернышек за 100 рублей)
            const bonusPoints = Math.floor(total / 100) * 10;

            const {error: profileError} = await supabase
                .from('profiles')
                .update({bonus_points: bonusPoints})
                .eq('id', user.id);

            if (profileError) throw profileError;

            dispatch(clearCart());

            navigate('/checkout/success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка оформления заказа');
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className={styles.checkout}>
                <Typography variant="h4" className={styles.checkout__title}>
                    Оформление заказа
                </Typography>
                <p>Ваша корзина пуста</p>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/menu')}
                    className={styles.checkout__backButton}
                >
                    Вернуться в меню
                </Button>
            </div>
        );
    }

    return (
        <div className={styles.checkout}>
            <Typography variant="h4" className={styles.checkout__title}>
                Оформление заказа
            </Typography>

            <div className={styles.checkout__container}>
                <div className={styles.checkout__summary}>
                    <Typography variant="h6" className={styles.checkout__subtitle}>
                        Ваш заказ
                    </Typography>
                    <ul className={styles.checkout__items}>
                        {items.map((item) => (
                            <li key={item.id} className={styles.checkout__item}>
                                <span className={styles.checkout__itemName}>
                                    {item.name} × {item.quantity}
                                </span>
                                <span className={styles.checkout__itemPrice}>
                                    {(item.price * item.quantity).toFixed(2)} ₽
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.checkout__total}>
                        <span>Итого:</span>
                        <span className={styles.checkout__totalAmount}>{total.toFixed(2)} ₽</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.checkout__form}>
                    <Typography variant="h6" className={styles.checkout__subtitle}>
                        Способ оплаты
                    </Typography>

                    <div className={styles.checkout__paymentMethods}>
                        <label className={styles.checkout__paymentMethod}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                            />
                            <span>Банковская карта</span>
                        </label>

                        <label className={styles.checkout__paymentMethod}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash"
                                checked={paymentMethod === 'cash'}
                                onChange={() => setPaymentMethod('cash')}
                            />
                            <span>Наличными при получении</span>
                        </label>
                    </div>

                    {paymentMethod === 'card' && (
                        <div className={styles.checkout__cardForm}>
                            <div className={styles.checkout__formGroup}>
                                <label>Номер карты</label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder="1234 5678 9012 3456"
                                    required
                                />
                            </div>

                            <div className={styles.checkout__formRow}>
                                <div className={styles.checkout__formGroup}>
                                    <label>Срок действия</label>
                                    <input
                                        type="text"
                                        value={cardExpiry}
                                        onChange={(e) => setCardExpiry(e.target.value)}
                                        placeholder="ММ/ГГ"
                                        required
                                    />
                                </div>

                                <div className={styles.checkout__formGroup}>
                                    <label>CVV</label>
                                    <input
                                        type="text"
                                        value={cardCvc}
                                        onChange={(e) => setCardCvc(e.target.value)}
                                        placeholder="123"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {error && <div className={styles.checkout__error}>{error}</div>}

                    <Button
                        type="submit"
                        variant="secondary"
                        fullWidth
                        disabled={isProcessing}
                        className={styles.checkout__submit}
                    >
                        {isProcessing ? 'Оформление...' : 'Оплатить'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
