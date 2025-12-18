'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuthStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()



  // Helper to get auth_token from cookie
  function getTokenFromCookie() {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/auth_token=([^;]+)/);
    return match ? match[1] : null;
  }

  // Axios interceptor: always attach token from cookie
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const token = getTokenFromCookie() || (typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null);
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      } else if (config.headers) {
        delete config.headers['Authorization'];
      }
      return config;
    });
    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  useEffect(() => {
    // Always set axios header from cookie on mount
    // Ensure axios will send cookies when calling the API
    axios.defaults.withCredentials = true;
    const token = getTokenFromCookie();
    const lsToken = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const effective = token || lsToken;
    if (effective) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${effective}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    // Only call /me if we actually have a token available.
    if (effective) {
      checkAuthStatus();
    } else {
      // No token: mark as not authenticated and stop loading
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Always set header before request
      const token = getTokenFromCookie() || (typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null);
      if (!token) {
        // Nothing to check.
        // eslint-disable-next-line no-console
        console.debug('[Auth] checkAuthStatus: no token, skipping /me');
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Debug: log token/header
      // eslint-disable-next-line no-console
      console.debug('[Auth] checkAuthStatus token:', token);
      // eslint-disable-next-line no-console
      console.debug('[Auth] axios default auth header:', axios.defaults.headers.common['Authorization']);

      const response = await axios.get(`${API_URL}/me`);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      })
      // Debug: log response
      // eslint-disable-next-line no-console
      console.debug('[Auth] login response.data:', response.data)

      const { access_token } = response.data || {};
      if (!access_token) {
        // eslint-disable-next-line no-console
        console.error('[Auth] login did not return access_token')
        throw new Error('Login failed: no token')
      }

      // Store token in cookie (use capitalized attributes)
      try {
        document.cookie = `auth_token=${access_token}; path=/; max-age=1800; SameSite=Lax`;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[Auth] failed to set cookie', e)
      }

      // Also store in localStorage as a fallback
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('auth_token', access_token);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[Auth] failed to set localStorage', e)
      }

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      axios.defaults.withCredentials = true;

      // Debug: log after login
      // eslint-disable-next-line no-console
      console.debug('[Auth] login stored token:', access_token)
      // eslint-disable-next-line no-console
      console.debug('[Auth] axios default auth header after login:', axios.defaults.headers.common['Authorization'])

      setIsAuthenticated(true)
      await checkAuthStatus() // Get user info
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed')
    }
  }

  const logout = () => {
    // Clear token cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

    // Clear localStorage token
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_token');
    }

    // Clear axios header
    delete axios.defaults.headers.common['Authorization']

    setIsAuthenticated(false)
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      checkAuthStatus
    }}>
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

