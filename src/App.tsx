import {HashRouter, Routes, Route} from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import AuthPage from './pages/AuthPage';
import styles from './App.module.scss';
import CheckoutSuccess from './pages/CheckoutSuccess';


function App() {
    return (
        <HashRouter>
            <div className={styles.app}>
                <Header />
                <main className={styles.main}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/login" element={<AuthPage />} />
                        <Route path="/checkout/success" element={<CheckoutSuccess />} />
                    </Routes>
                </main>
            </div>
        </HashRouter>
    );
}

export default App;
