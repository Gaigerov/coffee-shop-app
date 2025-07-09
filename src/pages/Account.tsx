import React, {useEffect} from 'react';
import {useAppSelector, useAppDispatch} from '../store';
import {logout} from '../features/auth/authSlice';
import {supabase} from '../utils/supabaseClient';
import Button from '../components/ui/Button';
import styles from './Account.module.scss';
import Typography from '@mui/material/Typography';
import type {Order} from '../types/types';
import {useNavigate} from 'react-router-dom';

const Account: React.FC = () => {
    const dispatch = useAppDispatch();
    const {user} = useAppSelector((state) => state.auth);
    const [bonusPoints, setBonusPoints] = React.useState(0);
    const [orderHistory, setOrderHistory] = React.useState<Order[]>([]);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        dispatch(logout());
        navigate('/');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            setLoading(true);
            try {
                // Загрузка бонусных баллов
                const {data: profileData, error: profileError} = await supabase
                    .from('profiles')
                    .select('bonus_points')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;

                if (profileData) {
                    setBonusPoints(profileData.bonus_points || 0);
                }

                // Загрузка истории заказов
                const {data: ordersData, error: ordersError} = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', {ascending: false});

                if (ordersError) throw ordersError;

                setOrderHistory(ordersData || []);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    if (!user) {
        return (
            <div className={styles.account}>
                <Typography variant="h4" className={styles.account__title}>
                    Личный кабинет
                </Typography>
                <p>Пожалуйста, войдите в систему</p>
            </div>
        );
    }

    return (
        <div className={styles.account}>
            <Typography variant="h4" className={styles.account__title}>
                Личный кабинет
            </Typography>

            <div className={styles.account__info}>
                <div className={styles.account__card}>
                    <Typography variant="h6" className={styles.account__subtitle}>
                        Личные данные
                    </Typography>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Зарегистрирован:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                </div>

                <div className={styles.account__card}>
                    <Typography variant="h6" className={styles.account__subtitle}>
                        Бонусные баллы
                    </Typography>
                    <div className={styles.account__bonus}>
                        <span className={styles.account__bonusPoints}>{bonusPoints}</span>
                        <span>зернышек</span>
                    </div>
                    <p className={styles.account__bonusInfo}>1 зернышко = 1 рубль</p>
                </div>
            </div>

            <div className={styles.account__orders}>
                <Typography variant="h6" className={styles.account__subtitle}>
                    История заказов
                </Typography>

                {loading ? (
                    <p>Загрузка истории заказов...</p>
                ) : orderHistory.length === 0 ? (
                    <p>У вас пока нет заказов</p>
                ) : (
                    <div className={styles.account__orderList}>
                        {orderHistory.map((order) => (
                            <div key={order.id} className={styles.account__order}>
                                <div className={styles.account__orderHeader}>
                                    <span>Заказ #{order.id.slice(0, 8)}</span>
                                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className={styles.account__orderDetails}>
                                    <span>Статус: {order.status}</span>
                                    <span>Сумма: {order.total.toFixed(2)} ₽</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.account__actions}>
                <Button
                    variant="secondary"
                    onClick={handleLogout}
                    className={styles.account__logout}
                >
                    Выйти
                </Button>
            </div>
        </div>
    );
};

export default Account;
