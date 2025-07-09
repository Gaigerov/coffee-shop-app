import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {User} from '@supabase/supabase-js';
import {supabase} from '../../utils/supabaseClient';
import type {AppDispatch} from '../../store';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const {setUser, setLoading, setError, logout} = authSlice.actions;

export const checkSession = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const {data, error} = await supabase.auth.getUser();
        if (error) throw error;
        dispatch(setUser(data.user));
    } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Ошибка авторизации'));
    } finally {
        dispatch(setLoading(false));
    }
};

export default authSlice.reducer;
