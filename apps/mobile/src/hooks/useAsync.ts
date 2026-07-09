import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../api/client';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Charge une ressource asynchrone et expose { data, loading, error, reload }.
 * `deps` déclenche un rechargement (ex. paramètre de route).
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fn()
      .then((res) => {
        if (active) setData(res);
      })
      .catch((e) => {
        if (active) setError(e instanceof ApiError ? e.message : 'Erreur de chargement.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(run, [run]);

  return { data, loading, error, reload: run };
}
