import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import type { LoginDTO, RegisterDTO, UserDTO } from '@lasylab/shared';
import { authApi, type UpdateProfilePayload } from '../api/auth';
import { setAuthToken } from '../api/client';

const TOKEN_KEY = 'lasylab.token';

interface SessionContextValue {
  user: UserDTO | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (payload: RegisterDTO) => Promise<void>;
  login: (payload: LoginDTO) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<UserDTO>;
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaure la session au démarrage.
  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          setAuthToken(token);
          const me = await authApi.me();
          setUser(me);
        }
      } catch {
        // Jeton invalide/expiré : on repart déconnecté.
        setAuthToken(null);
        await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persistToken = useCallback(async (token: string) => {
    setAuthToken(token);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }, []);

  const register = useCallback(
    async (payload: RegisterDTO) => {
      const res = await authApi.register(payload);
      await persistToken(res.accessToken);
      setUser(res.user);
    },
    [persistToken],
  );

  const login = useCallback(
    async (payload: LoginDTO) => {
      const res = await authApi.login(payload);
      await persistToken(res.accessToken);
      setUser(res.user);
    },
    [persistToken],
  );

  const logout = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
  }, []);

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    const updated = await authApi.updateProfile(payload);
    setUser(updated);
    return updated;
  }, []);

  const refresh = useCallback(async () => {
    const me = await authApi.me();
    setUser(me);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      register,
      login,
      logout,
      updateProfile,
      refresh,
    }),
    [user, isLoading, register, login, logout, updateProfile, refresh],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession doit être utilisé dans un <SessionProvider>.');
  }
  return ctx;
}
