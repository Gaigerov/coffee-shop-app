import {createSlice, createAsyncThunk, type PayloadAction} from '@reduxjs/toolkit';
import type {User, Session} from '@supabase/supabase-js';
import {AuthService} from '../../services/authService';

const USER_KEY = 'coffee_shop_user';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    error: string | null;
}

export interface SignUpResult {
    user: User | null;
    session: Session | null;
    needsConfirmation?: boolean;
}

const loadUserFromStorage = (): AuthState => {
    try {
        const savedUser = localStorage.getItem(USER_KEY);
        return savedUser
            ? {
                  user: JSON.parse(savedUser),
                  session: null,
                  isLoading: false,
                  error: null
              }
            : {
                  user: null,
                  session: null,
                  isLoading: false,
                  error: null
              };
    } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        return {user: null, session: null, isLoading: false, error: null};
    }
};

const initialState: AuthState = loadUserFromStorage();

export const checkSession = createAsyncThunk('auth/checkSession', async (_, {dispatch}) => {
    dispatch(setLoading(true));
    try {
        const {session, error} = await AuthService.getSession();
        if (error) throw error;

        const user = session?.user || null;
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
        return {user, session};
    } catch (error) {
        throw error instanceof Error ? error.message : 'Ошибка авторизации';
    } finally {
        dispatch(setLoading(false));
    }
});

export const signInUser = createAsyncThunk(
    'auth/signIn',
    async ({email, password}: {email: string; password: string}, {dispatch}) => {
        dispatch(setLoading(true));
        try {
            const {user, session, error} = await AuthService.signIn(email, password);
            if (error) throw error;

            if (user) {
                localStorage.setItem(USER_KEY, JSON.stringify(user));
            }

            return {user, session};
        } catch (error) {
            throw error instanceof Error ? error.message : 'Ошибка входа';
        } finally {
            dispatch(setLoading(false));
        }
    }
);

export const signUpUser = createAsyncThunk(
    'auth/signUp',
    async ({email, password}: {email: string; password: string}, {dispatch}) => {
        dispatch(setLoading(true));
        try {
            const {user, session, error, needsConfirmation} = await AuthService.signUp(email, password);
            if (error) throw error;

            if (user) {
                await AuthService.createProfile(user.id, {
                    email,
                    bonus_points: 0
                });
            }

            return {user, session, needsConfirmation} as SignUpResult;
        } catch (error) {
            throw error instanceof Error ? error.message : 'Ошибка регистрации';
        } finally {
            dispatch(setLoading(false));
        }
    }
);

export const signOutUser = createAsyncThunk('auth/signOut', async () => {
    try {
        await AuthService.signOut();
        localStorage.removeItem(USER_KEY);
        return null;
    } catch (error) {
        throw error instanceof Error ? error.message : 'Ошибка выхода';
    }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (email: string, {dispatch}) => {
    dispatch(setLoading(true));
    try {
        const {error} = await AuthService.resetPassword(email);
        if (error) throw error;
        return true;
    } catch (error) {
        throw error instanceof Error ? error.message : 'Ошибка сброса пароля';
    } finally {
        dispatch(setLoading(false));
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
            } else {
                localStorage.removeItem(USER_KEY);
            }
        },
        setSession: (state, action: PayloadAction<Session | null>) => {
            state.session = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(checkSession.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.session = action.payload.session;
                state.error = null;
            })
            .addCase(checkSession.rejected, (state, action) => {
                state.error = action.error.message || null;
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.session = action.payload.session;
                state.error = null;
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.error = action.error.message || null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                if (!action.payload.needsConfirmation) {
                    state.user = action.payload.user;
                    state.session = action.payload.session;
                }
                state.error = null;
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.error = action.error.message || null;
            })
            .addCase(signOutUser.fulfilled, state => {
                state.user = null;
                state.session = null;
                state.error = null;
            })
            .addCase(signOutUser.rejected, (state, action) => {
                state.error = action.error.message || null;
            })
            .addCase(resetPassword.fulfilled, state => {
                state.error = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.error = action.error.message || null;
            });
    }
});

export const {setUser, setSession, setLoading, setError} = authSlice.actions;
export default authSlice.reducer;
