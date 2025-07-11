import React from 'react';
import {Link} from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './Home.module.scss';
import Typography from '@mui/material/Typography';

const Home: React.FC = () => {
    return (
        <div className={styles.home}>
            <section className={styles.home__hero}>
                <div className={styles.home__heroContent}>
                    <Typography variant="h1" className={styles.home__title}>
                        Добро пожаловать в CoffeeBean
                    </Typography>
                    <Typography variant="h5" className={styles.home__subtitle}>
                        Наслаждайтесь лучшим кофе в городе
                    </Typography>
                    <Link to="/menu">
                        <Button variant="primary" size="large">
                            Посмотреть меню
                        </Button>
                    </Link>
                </div>
            </section>

            <section className={styles.home__features}>
                <div className={styles.home__feature}>
                    <div className={styles.home__featureIcon}>☕</div>
                    <Typography variant="h6">Свежеобжаренный кофе</Typography>
                    <Typography>Ежедневная обжарка зерен для идеального вкуса</Typography>
                </div>

                <div className={styles.home__feature}>
                    <div className={styles.home__featureIcon}>🎁</div>
                    <Typography variant="h6">Бонусная программа</Typography>
                    <Typography>Получайте зернышки за каждую покупку</Typography>
                </div>

                <div className={styles.home__feature}>
                    <div className={styles.home__featureIcon}>🚚</div>
                    <Typography variant="h6">Быстрая доставка</Typography>
                    <Typography>Привезем ваш заказ за 30 минут</Typography>
                </div>
            </section>

            <section className={styles.home__cta}>
                <Typography variant="h3">Попробуйте наш новый сорт кофе</Typography>
                <Typography variant="h6">
                    Эксклюзивная смесь из Эфиопии и Колумбии
                </Typography>
                <Link to="/menu">
                    <Button variant="warm">Заказать сейчас</Button>
                </Link>
            </section>
        </div>
    );
};

export default Home;
