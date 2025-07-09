// src/components/Header.tsx
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useAppSelector} from '../../store/index';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Button from '../ui/Button';
import styles from './Header.module.scss';

const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const cartItems = useAppSelector(state => state.cart.items);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <Link to="/" className={styles.logo}>
                    սուրճ եք ուզում
                </Link>

                {/* Мобильное меню - кнопка */}
                <Button
                    variant="outlined"
                    className={styles.mobileMenuButton}
                    onClick={toggleMobileMenu}
                >
                    {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </Button>

                {/* Десктопное меню */}
                <div className={`${styles.links} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                    <Link to="/menu" className={styles.link} onClick={() => setMobileMenuOpen(false)}>Меню</Link>
                    <Link to="/account" className={styles.link} onClick={() => setMobileMenuOpen(false)}>Личный кабинет</Link>
                    <Link to="/cart" className={styles.cartLink} onClick={() => setMobileMenuOpen(false)}>
                        <ShoppingCartIcon />
                        {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
