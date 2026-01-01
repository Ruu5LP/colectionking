import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export const useApi = <T,>(url: string, autoFetch = true): UseApiState<T> & { refetch: () => Promise<void> } => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: autoFetch,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.get<T>(url);
      setState({ data: response.data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [url]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { ...state, refetch: fetchData };
};

export const apiPost = async <T, D = unknown>(url: string, data: D): Promise<T> => {
  const response = await axios.post<T>(url, data);
  return response.data;
};

export const apiGet = async <T,>(url: string): Promise<T> => {
  const response = await axios.get<T>(url);
  return response.data;
};
