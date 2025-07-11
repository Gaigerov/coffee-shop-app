import React, {useState, useEffect} from 'react';
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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [mobileMenuOpen]);

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.leftSection}>
                    <Link to="/" className={styles.logo} onClick={() => setMobileMenuOpen(false)}>
                        кофе будешь
                    </Link>
                </div>

                <div className={styles.rightSection}>

                    <div className={styles.desktopLinks}>
                        <Link to="/menu" className={styles.link}>Меню</Link>
                        <Link to="/account" className={styles.link}>Личный кабинет</Link>
                    </div>

                    <Link to="/cart" className={styles.cartLink} onClick={() => setMobileMenuOpen(false)}>
                        <ShoppingCartIcon />
                        {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
                    </Link>

                    <Button
                        variant="outlined"
                        className={`${styles.mobileMenuButton} ${mobileMenuOpen ? styles.menuOpen : ''}`}
                        onClick={toggleMobileMenu}
                    >
                        {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </Button>
                </div>

                <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                    <Link to="/menu" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                        Меню
                    </Link>
                    <Link to="/account" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                        Личный кабинет
                    </Link>
                    <Link to="/cart" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                        Корзина
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
