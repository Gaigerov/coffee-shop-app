import React, {useEffect, useRef, useState} from 'react';
import {useAppSelector, useAppDispatch} from '../store';
import {clearCart} from '../features/cart/cartSlice';
import Button from '../components/ui/Button';
import styles from './Checkout.module.scss';
import {useNavigate} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import {StripeService} from '../services/stripeService';
import {OrderService} from '../services/orderService';
import {supabase} from '../utils/supabaseClient';

const Checkout: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {items} = useAppSelector((state) => state.cart);
    const {user} = useAppSelector((state) => state.auth);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bonusPointsUsed, setBonusPointsUsed] = useState(0);
    const [userBonusPoints, setUserBonusPoints] = useState(0);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = Math.max(0, total - bonusPointsUsed);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchUserBonusPoints = async () => {
            try {
                const {data: profile, error} = await supabase
                    .from('profiles')
                    .select('bonus_points')
                    .eq('id', user.id)
                    .maybeSingle();

                if (error) throw error;

                if (!profile) {
                    const {error: createError} = await supabase
                        .from('profiles')
                        .insert([{
                            id: user.id,
                            email: user.email,
                            bonus_points: 0
                        }]);

                    if (createError) throw createError;
                    setUserBonusPoints(0);
                } else {
                    setUserBonusPoints(profile.bonus_points || 0);
                }
            } catch (err) {
                console.error('Ошибка получения бонусных баллов:', err);
                setUserBonusPoints(0);
            }
        };

        fetchUserBonusPoints();
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);

        try {
            if (!user) throw new Error('Пользователь не авторизован');

            const orderItems = items.map(item => ({
                product_id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            }));

            if (paymentMethod === 'card') {
                const order = await OrderService.createOrder(
                    user.id,
                    orderItems,
                    finalTotal,
                    bonusPointsUsed,
                );

                localStorage.setItem('last_order_id', order.id);

                const successUrl = `${window.location.origin}/#/checkout/success`;
                const cancelUrl = `${window.location.origin}/#/checkout`;

                await StripeService.createCheckoutSession(
                    items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: Math.round(item.price * 100),
                        quantity: item.quantity,
                    })),
                    successUrl,
                    cancelUrl
                );
            }

            else if (paymentMethod === 'cash') {

                const order = await OrderService.createOrder(
                    user.id,
                    orderItems,
                    finalTotal,
                    bonusPointsUsed,
                    'completed'
                );

                const bonusPointsEarned = Math.floor(finalTotal / 100) * 10;
                const newBonusPoints = userBonusPoints - bonusPointsUsed + bonusPointsEarned;

                await supabase
                    .from('profiles')
                    .update({bonus_points: newBonusPoints})
                    .eq('id', user.id);

                localStorage.setItem('last_order_id', order.id);

                dispatch(clearCart());
                navigate('/checkout/success');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка оформления заказа');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBonusPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;
        const points = value === '' ? 0 : parseInt(value);
        const maxPoints = Math.min(userBonusPoints, total);
        setBonusPointsUsed(Math.min(points, maxPoints));
    };

    const handleFocus = () => {
        setIsInputFocused(true);
        if (bonusPointsUsed === 0 && inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleBlur = () => {
        setIsInputFocused(false);
        if (inputRef.current && inputRef.current.value === '') {
            setBonusPointsUsed(0);
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

                    {userBonusPoints > 0 && (
                        <div className={styles.checkout__bonusSection}>
                            <Typography variant="h6" className={styles.checkout__subtitle}>
                                Бонусные баллы "зернышки"
                            </Typography>
                            <div className={styles.checkout__bonusControl}>
                                <label>
                                    Использовать баллы (доступно: {userBonusPoints})
                                    <input
                                        ref={inputRef}
                                        type="number"
                                        min="0"
                                        max={Math.min(userBonusPoints, total)}
                                        value={isInputFocused && bonusPointsUsed === 0 ? '' : bonusPointsUsed}
                                        onChange={handleBonusPointsChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        className={styles.checkout__bonusInput}
                                    />
                                </label>
                                <span className={styles.checkout__bonusDiscount}>
                                    Скидка: -{bonusPointsUsed.toFixed(2)} ₽
                                </span>
                            </div>
                        </div>
                    )}

                    <div className={styles.checkout__total}>
                        <span>Итого:</span>
                        <span className={styles.checkout__totalAmount}>
                            {finalTotal.toFixed(2)} ₽
                        </span>
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
                            <span>Банковская карта (Stripe)</span>
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

                    {error && <div className={styles.checkout__error}>{error}</div>}

                    <Button
                        type="submit"
                        variant="warm"
                        fullWidth
                        disabled={isProcessing}
                        className={styles.checkout__submit}
                    >
                        {isProcessing ? 'Оформление...' : 'Оформить заказ'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
