import { useState, useEffect, createContext, useContext } from 'react'
import api from '@/lib/api'

interface AuthContextType {
  isAuthenticated: boolean
  user: any | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      // Vérifier si le token est valide
      api.get('/admin/me')
        .then(response => {
          setUser(response.data)
          setIsAuthenticated(true)
        })
        .catch(() => {
          localStorage.removeItem('adminToken')
          setIsAuthenticated(false)
          setUser(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/admin/login', { email, password })
      const { access_token } = response.data
      localStorage.setItem('adminToken', access_token)
      
      // Récupérer les informations de l'admin
      const userResponse = await api.get('/admin/me')
      setUser(userResponse.data)
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 