import { createContext } from "react";
export type UserType = {
    name: string,
    email: string,
    id?: number
}

export type AuthContextProps = {
    logged: boolean,
    user: UserType,
    loading: boolean,
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

export default AuthContext