import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { api } from '../services/api'

WebBrowser.maybeCompleteAuthSession();

export interface UserProps {
    name: String;
    avatarUrl: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}


export const AuthContext = createContext({} as AuthContextDataProps)


export function AuthContextProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<UserProps>({} as UserProps);
    const [isUserLoading, setIsUserLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({useProxy: true}),
        scopes: ['profile','email']
    });

    // console.log('-----');
    // console.log(AuthSession.makeRedirectUri({useProxy:true}));
    // console.log('-----');

    async function signIn(){
        try {
            setIsUserLoading(true);
            await promptAsync();
            
        } catch (error) {
            console.log(error);
            throw error;
            
        } finally {
            setIsUserLoading(false);
        }

    };


    async function signInWithGoogle(access_token: string){
        //console.log('TOKEN DE AUTENTICAÇÃO ===>', access_token);
        try {
            setIsUserLoading(true);
            //console.log('1');
            const tokenResponse = await api.post('/users',{ access_token });
            //console.log(tokenResponse.data);
            //console.log('2');
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;
            //console.log(api.defaults.headers.common['Authorization']);
            const userInfoResponse = await api.get('/me');
            //console.log('4');
            setUser(userInfoResponse.data.user);
            //console.log('5');
            


        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsUserLoading(false);

        }
    };

    useEffect(() => {
        if (response?.type === 'success' && response.authentication?.accessToken){
            signInWithGoogle(response.authentication.accessToken);
        }
    },[response]);

    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user
        }}>
        {children}

        </AuthContext.Provider>
    );
}