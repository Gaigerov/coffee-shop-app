import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../store';
import {clearCart} from '../features/cart/cartSlice';
import {Link, useNavigate} from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './CheckoutSuccess.module.scss';
import Typography from '@mui/material/Typography';
import {supabase} from '../utils/supabaseClient';
import type {Order} from '../services/orderService';


const CheckoutSuccess: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {user} = useAppSelector((state) => state.auth);
    const orderId = localStorage.getItem('last_order_id');
    const [orderDetails, setOrderDetails] = useState<Order | null>(null); // Типизация
    const [bonusPoints, setBonusPoints] = useState(0);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        dispatch(clearCart());

        const fetchData = async () => {
            try {
                if (orderId) {
                    const {data, error} = await supabase
                        .from('orders')
                        .select('*')
                        .eq('id', orderId)
                        .single();

                    if (error) throw error;
                    setOrderDetails(data);
                }

                const {data: profile, error: profileError} = await supabase
                    .from('profiles')
                    .select('bonus_points')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;
                setBonusPoints(profile?.bonus_points || 0);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };

        fetchData();

        return () => {
            localStorage.removeItem('last_order_id');
        };
    }, [dispatch, navigate, user, orderId]);

    const calculatedBonus = orderDetails
        ? Math.floor(orderDetails.total / 100) * 10
        : 0;

    return (
        <div className={styles.success}>
            <div className={styles.success__card}>
                <div className={styles.success__icon}>🎉</div>

                <Typography variant="h4" className={styles.success__title}>
                    Заказ успешно оформлен!
                </Typography>

                {orderId && (
                    <p className={styles.success__orderId}>
                        Номер вашего заказа: <strong>#{orderId.slice(0, 8).toUpperCase()}</strong>
                    </p>
                )}

                <p className={styles.success__message}>
                    Спасибо за ваш заказ! Мы уже начали готовить ваш кофе.
                    {orderDetails && (
                        <>
                            <br />Сумма заказа: <strong>{orderDetails.total.toFixed(2)} ₽</strong>
                        </>
                    )}
                </p>

                <div className={styles.success__bonus}>
                    <Typography variant="body1">
                        Ваши бонусные зерна: <strong>{bonusPoints}</strong>
                    </Typography>
                    {calculatedBonus > 0 && (
                        <Typography variant="body2">
                            +{calculatedBonus} зерен за этот заказ!
                        </Typography>
                    )}
                </div>

                <div className={styles.success__actions}>
                    <Link to="/menu">
                        <Button variant="outlined" className={styles.success__button}>
                            Вернуться в меню
                        </Button>
                    </Link>

                    <Link to="/account">
                        <Button variant="primary" className={styles.success__button}>
                            Посмотреть заказы
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
