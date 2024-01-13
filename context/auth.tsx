'use client'

import { createContext, useContext, useState } from "react"
import type { SetStateAction, Dispatch, ReactNode } from "react"

export type AuthUserType = {
  sourceId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  picture?: string;
  role?: string;
}

type AuthContextType = {
  user: AuthUserType | null
  setUser: Dispatch<SetStateAction<null>>
};

type Props = {
  children: ReactNode;
};

const authContextDefaultValues: AuthContextType = {
  user: null,
  setUser: () => {},
};

const AuthContext = createContext<AuthContextType>(authContextDefaultValues);

export const useAuth = () => {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState(null);

  const value = {
    user,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
