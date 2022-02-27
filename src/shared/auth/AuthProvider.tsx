import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Api from "../Api";
import AuthContext, { UserType } from "./AuthContext";

const LC_TOKEN = 'auth_token'

function AuthProvider(props: any) {

    const [user, setUser] = useState<UserType>({} as UserType)
    const [logged, setLogged] = useState(false)
    const [loading, setLoading] = useState(true)

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const interceptorResponse = Api.interceptors.response.use(response => response, error => {
            if(error.response.status === 401) {
                toast.warning('Sua sessão expirou')
                logout()
            } else {
                return Promise.reject(error)
            }
        })

        const interceptorRequest = Api.interceptors.request.use(config => {
            if (localStorage.getItem(LC_TOKEN)) {
                config.headers = { 'Authorization': `Bearer ${localStorage.getItem(LC_TOKEN)}` }
            }        
            return config
        }, error => {
            return Promise.reject(error)
        })

        return () => {
            Api.interceptors.response.eject(interceptorResponse)
            Api.interceptors.request.eject(interceptorRequest)
        }            

    }, [])

    useEffect(() => {
        const token = getToken()

        if(!token) {
            setLogged(false)
            setLoading(false)
        } else {
            loadUser()
        }

    }, [])

    async function login(token: string) {
        setToken(token)
        loadUser()
    }

    async function logout() {
        setToken()
        navigate('/login')
    }

    async function loadUser() {
        
        setLoading(true)
        try {
            const { data } = await Api.get('me')

            setUser(data)
            setLogged(true)
            
            if(location.pathname === '/login') {
                navigate('/')
            }
        } catch (error) {
            
        }
        setLoading(false)
    }

    function getToken() {
        return localStorage.getItem(LC_TOKEN)
    }

    function setToken(token?: string) {
        if(token) {
            localStorage.setItem(LC_TOKEN, token)
        } else {
            localStorage.removeItem(LC_TOKEN)
        }
    }

    return <AuthContext.Provider value={{logged, loading, user, login, logout}}>{props.children}</AuthContext.Provider>
}

export default AuthProvider