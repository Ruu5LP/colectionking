import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'colectionking_user_id';

export const useUserId = (): string => {
  const [userId, setUserId] = useState<string>(() => {
    // Try to get existing userId from localStorage
    const stored = localStorage.getItem(USER_ID_KEY);
    if (stored) {
      return stored;
    }
    
    // Generate new userId if not exists
    const newId = uuidv4();
    localStorage.setItem(USER_ID_KEY, newId);
    return newId;
  });

  useEffect(() => {
    // Ensure userId is always in localStorage
    localStorage.setItem(USER_ID_KEY, userId);
  }, [userId]);

  return userId;
};
