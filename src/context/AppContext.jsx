import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../config/constants';

// Create context
const AppContext = createContext(null);

/**
 * AppContext Provider component
 */
export function AppProvider({ children }) {
  const [records, setRecords] = useLocalStorage(STORAGE_KEYS.RECORDS, []);
  const [currentUser, setCurrentUser] = useLocalStorage(STORAGE_KEYS.USER, {
    name: '',
    totalPoints: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // ─── Theme state ─────────────────────────────────────────────────────────
  const [theme, setTheme] = useLocalStorage('ecoscan_theme', 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  // Simulate loading on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // ─── Record helpers ───────────────────────────────────────────────────────
  const addRecord = useCallback(
    (record) => {
      setRecords((prev) => [record, ...prev]);
      setCurrentUser((prev) => ({
        ...prev,
        totalPoints: (prev?.totalPoints || 0) + (record.greenPoints || 0),
      }));
    },
    [setRecords, setCurrentUser]
  );

  const clearRecords = useCallback(() => {
    setRecords([]);
    setCurrentUser((prev) => ({ ...prev, totalPoints: 0 }));
  }, [setRecords, setCurrentUser]);

  const setUser = useCallback((user) => setCurrentUser(user), [setCurrentUser]);

  const getTotalScans = useCallback(() => records.length, [records]);
  const getTotalCO2Saved = useCallback(() => records.reduce((s, r) => s + (r.carbonSaved || 0), 0), [records]);
  const getTotalGreenPoints = useCallback(() => records.reduce((s, r) => s + (r.greenPoints || 0), 0), [records]);
  const getTotalWeight = useCallback(() => records.reduce((s, r) => s + (r.weight || 0), 0), [records]);

  const getRecordsByUser = useCallback(
    (userId) => records.filter((r) => r.userId === userId),
    [records]
  );

  const getUserStats = useCallback(
    (userId) => {
      const userRecords = getRecordsByUser(userId);
      return {
        scans: userRecords.length,
        co2Saved: userRecords.reduce((s, r) => s + (r.carbonSaved || 0), 0),
        greenPoints: userRecords.reduce((s, r) => s + (r.greenPoints || 0), 0),
        weight: userRecords.reduce((s, r) => s + (r.weight || 0), 0),
      };
    },
    [getRecordsByUser]
  );

  const value = {
    records,
    currentUser,
    isLoading,
    theme,
    toggleTheme,
    addRecord,
    clearRecords,
    setUser,
    getTotalScans,
    getTotalCO2Saved,
    getTotalGreenPoints,
    getTotalWeight,
    getRecordsByUser,
    getUserStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === null) throw new Error('useApp must be used within an AppProvider');
  return context;
}

export default AppContext;
