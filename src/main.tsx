import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';
import App from './App'
import {store} from './store'
import {Provider} from 'react-redux'
import {ThemeProvider} from '@mui/material/styles';
import theme from './theme';
import { supabase } from './utils/supabaseClient';
import {setSession, setUser} from './features/auth/authSlice';

supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    store.dispatch(setUser(session.user));
    store.dispatch(setSession(session));
  }
});

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    store.dispatch(setUser(session.user));
    store.dispatch(setSession(session));
    localStorage.setItem('coffee_shop_user', JSON.stringify(session.user));
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
)

