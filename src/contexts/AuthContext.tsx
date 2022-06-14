import { createContext, ReactNode, useState, useEffect } from 'react';

import { api } from '../services/apiClient';

import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';    //send user to a route in a indirect way

import { toast } from 'react-toastify';

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>; 
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try{
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    }catch{
        console.log('error ao deslogar')
    }
}

export function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;    // !! = convertendo para false se não tiver nenhum valor dentro

    useEffect(() => {
        
        //try to get something in cookie
        const { '@nextauth.token': token } = parseCookies();

        if(token){
            api.get('/userinfo').then(response => {
                const { id, name, email } = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(() => {
                //if it got error we log out the user.
                signOut();
            })
        }


    }, [])

   async function signIn({ email, password }: SignInProps){
        try{
            const response = await api.post('/session', {
                email,
                password,
            }) 

            const { id, name, token } = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // expires in one month
                path: "/" //which paths gonna have access to the cookie.   '/' = all paths
            } )

            setUser({
                id,
                name,
                email,
            })

            //to pass to the next requisitions our token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success("Login feito com sucesso!")

            //redirect user to the /dashboard
            Router.push('/dashboard')


        }catch(err){
            toast.error("Erro ao acessar a plataforma :/")
            console.log('erro ao acessar', err)
        }
    }

    async function signUp({ name, email, password}: SignUpProps){
        try{
            const response = await api.post('/users', {
                name,
                email,
                password
            })

            toast.success("Conta criada com sucesso!")

            Router.push('/')

        }catch(err){
            toast.error("Erro ao cadastrar :/")
            console.log("erro ao cadastrar ", err)
        }
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}