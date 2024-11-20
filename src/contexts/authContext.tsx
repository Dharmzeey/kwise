import { fetchAuthenticatedUser } from "@/utils/cookieUtils";
import React, { createContext, useContext, useEffect, useState } from "react"

const UserContext = createContext<string>('');

export const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [user, setUser] = useState<string | null>('')

    useEffect(() => {
        const getUser = async () => {
            const authenticatedUser = await fetchAuthenticatedUser()
            setUser(authenticatedUser)
            // setIsLoading(false)
        }
        getUser()
    })

    return (
        <UserContext.Provider value={user!}>
            {children}
        </UserContext.Provider>
    )
}

export const useAuthContext = () => useContext(UserContext);