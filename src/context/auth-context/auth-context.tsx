// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1️⃣ Create context with default value
const AuthContext = createContext({
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
});

// 2️⃣ Provide the context
export const AuthProvider = ({ children }: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAuthState = async () => {
            try {
                const storedAuth = await AsyncStorage.getItem('isAuthenticated');
                const createdAt = await AsyncStorage.getItem('CREATEDAT');

                if (storedAuth === 'true' && createdAt) {
                    const now = new Date();
                    const createdDate = new Date(createdAt);

                    // expiry = createdAt + 1 day
                    const expiryDate = new Date(createdDate);
                    expiryDate.setDate(expiryDate.getDate() + 1);

                    if (now < expiryDate) {
                        setIsAuthenticated(true);
                    } else {
                        // Expired → clear everything
                        await AsyncStorage.multiRemove(['isAuthenticated', 'CREATEDAT']);
                        setIsAuthenticated(false);
                    }
                }
            } catch (error) {
                console.error('Error loading auth state:', error);
            } finally {
                setLoading(false);
            }
        };
        loadAuthState();
    }, []);


    // Login function
    const login = async () => {
        setIsAuthenticated(true);
        await AsyncStorage.setItem('isAuthenticated', 'true');
    };

    // Logout function
    const logout = async () => {
        setIsAuthenticated(false);
        await AsyncStorage.removeItem('isAuthenticated');
    };

    if (loading) {
        // Prevents flicker while restoring auth state
        return null; // Or a splash screen component
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3️⃣ Custom hook
export const useAuth = () => useContext(AuthContext);
