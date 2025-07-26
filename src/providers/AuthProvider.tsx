'use client'

import { createContext, useContext } from 'react'
import { useAuth, AuthContext } from '@/lib/auth'

const AuthContextProvider = createContext<AuthContext | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContextProvider.Provider value={auth}>
      {children}
    </AuthContextProvider.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContextProvider)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}