import {supabase} from '../utils/supabaseClient';
import type {AuthError, Session, User} from '@supabase/supabase-js';

export interface AuthResponse {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
    needsConfirmation?: boolean | '';
}

interface ProfileData {
    email: string;
    full_name?: string;
    address?: string;
    bonus_points?: number;
}

export const AuthService = {
    async signUp(email: string, password: string): Promise<AuthResponse> {
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/#/login`
            }
        });

        const needsConfirmation = data.user?.confirmation_sent_at && !data.user?.email_confirmed_at;

        return {
            user: data.user || null,
            session: data.session || null,
            error,
            needsConfirmation
        };
    },

    async signIn(email: string, password: string): Promise<AuthResponse> {
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return {user: data?.user || null, session: data?.session || null, error};
    },

    async signOut(): Promise<{error: AuthError | null}> {
        const {error} = await supabase.auth.signOut();
        return {error};
    },

    async getSession(): Promise<{session: Session | null; error: AuthError | null}> {
        const {data, error} = await supabase.auth.getSession();
        return {session: data.session, error};
    },

    async getUser(): Promise<{user: User | null; error: AuthError | null}> {
        const {data, error} = await supabase.auth.getUser();
        return {user: data.user, error};
    },

    async resetPassword(email: string): Promise<{error: AuthError | null}> {
        const {error} = await supabase.auth.resetPasswordForEmail(email);
        return {error};
    },

    async createProfile(userId: string, profileData: ProfileData): Promise<void> {
        const {error} = await supabase.from('profiles').insert([{id: userId, ...profileData}]);

        if (error) throw new Error(error.message);
    }
};
