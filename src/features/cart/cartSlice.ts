import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

const CART_KEY = 'coffee_shop_cart';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface CartState {
    items: CartItem[];
}

const loadCartFromLocalStorage = (): CartState => {
    try {
        const savedCart = localStorage.getItem(CART_KEY);
        return savedCart ? JSON.parse(savedCart) : {items: []};
    } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
        return {items: []};
    }
};

const initialState: CartState = loadCartFromLocalStorage();

const saveCartToLocalStorage = (state: CartState) => {
    localStorage.setItem(CART_KEY, JSON.stringify(state));
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            saveCartToLocalStorage(state);
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveCartToLocalStorage(state);
        },
        updateQuantity: (state, action: PayloadAction<{id: string; quantity: number}>) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
                saveCartToLocalStorage(state);
            }
        },
        clearCart: state => {
            state.items = [];
            localStorage.removeItem(CART_KEY);
        },

        restoreCart: state => {
            const savedCart = loadCartFromLocalStorage();
            state.items = savedCart.items;
        }
    }
});

export const {addItem, removeItem, updateQuantity, clearCart, restoreCart} = cartSlice.actions;
export default cartSlice.reducer;
