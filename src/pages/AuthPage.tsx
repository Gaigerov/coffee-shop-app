import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {supabase} from '../utils/supabaseClient';
import Button from '../components/ui/Button';
import styles from './AuthPage.module.scss';

const AuthPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const {error} = await supabase.auth.signInWithPassword({email, password});
                if (error) throw error;
                navigate('/account');
            } else {
                const {error} = await supabase.auth.signUp({email, password});
                if (error) throw error;
                alert('Проверьте вашу почту для подтверждения регистрации');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={loading}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                </form>

                <div className={styles.switchMode}>
                    <p>
                        {isLogin ? 'Еще нет аккаунта?' : 'Уже есть аккаунт?'}
                    </p>
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        disabled={loading}
                    >
                        {isLogin ? 'Создать аккаунт' : 'Войти'}
                    </button>
                </div>

                <div className={styles.links}>
                    <Link to="/">Вернуться на главную</Link>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
