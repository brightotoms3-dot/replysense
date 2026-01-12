"use client";

import { useState, useEffect, useCallback } from "react";

const USAGE_LIMIT = 3;
const STORAGE_KEY = 'replysense_usage';

interface UsageData {
  count: number;
  date: string; // YYYY-MM-DD
}

const getToday = () => new Date().toISOString().split('T')[0];

export function useUsageLimit() {
  const [usage, setUsage] = useState<UsageData>({ count: 0, date: getToday() });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedUsage = localStorage.getItem(STORAGE_KEY);
      const today = getToday();
      
      if (storedUsage) {
        const parsedUsage: UsageData = JSON.parse(storedUsage);
        if (parsedUsage.date === today) {
          setUsage(parsedUsage);
        } else {
          // Reset for new day
          const newUsage = { count: 0, date: today };
          setUsage(newUsage);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
        }
      } else {
        // First time usage
        setUsage({ count: 0, date: today });
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
      // Fallback to in-memory state if localStorage is unavailable
      setUsage({ count: 0, date: getToday() });
    } finally {
        setIsInitialized(true);
    }
  }, []);

  const increment = useCallback(() => {
    if (!isInitialized) return;
    
    setUsage(prevUsage => {
      const newCount = prevUsage.count + 1;
      const newUsage = { ...prevUsage, count: newCount };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
      } catch (error) {
        console.error("Could not write to localStorage:", error);
      }
      return newUsage;
    });
  }, [isInitialized]);

  const resetUsage = useCallback(() => {
    if (!isInitialized) return;
    const today = getToday();
    const newUsage = { count: 0, date: today };
    setUsage(newUsage);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
    } catch (error) {
        console.error("Could not write to localStorage:", error);
    }
  }, [isInitialized]);

  const isLimitReached = useCallback(() => {
    if (!isInitialized) return true; // Block until initialized to be safe
    return usage.count >= USAGE_LIMIT;
  }, [usage.count, isInitialized]);

  return { count: usage.count, increment, isLimitReached, resetUsage };
}
