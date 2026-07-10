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
import { childrenApi } from '../api/children';
import { setAuthToken } from '../api/client';

const TOKEN_KEY = 'lasylab.token';

interface SessionContextValue {
  /** Identité active (le parent, ou l'enfant sélectionné). */
  user: UserDTO | null;
  /** Compte réellement connecté (le parent, même en mode enfant). */
  account: UserDTO | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Vrai quand un parent agit au nom d'un de ses enfants. */
  isChildActive: boolean;
  register: (payload: RegisterDTO) => Promise<UserDTO>;
  login: (payload: LoginDTO) => Promise<UserDTO>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<UserDTO>;
  refresh: () => Promise<void>;
  enterAsChild: (childId: string) => Promise<void>;
  exitToParent: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<UserDTO | null>(null);
  const [childUser, setChildUser] = useState<UserDTO | null>(null);
  const [accountToken, setAccountToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          setAuthToken(token);
          setAccountToken(token);
          setAccount(await authApi.me());
        }
      } catch {
        setAuthToken(null);
        await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persistToken = useCallback(async (token: string) => {
    setAuthToken(token);
    setAccountToken(token);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }, []);

  const register = useCallback(
    async (payload: RegisterDTO) => {
      const res = await authApi.register(payload);
      await persistToken(res.accessToken);
      setChildUser(null);
      setAccount(res.user);
      return res.user;
    },
    [persistToken],
  );

  const login = useCallback(
    async (payload: LoginDTO) => {
      const res = await authApi.login(payload);
      await persistToken(res.accessToken);
      setChildUser(null);
      setAccount(res.user);
      return res.user;
    },
    [persistToken],
  );

  const logout = useCallback(async () => {
    setAuthToken(null);
    setAccount(null);
    setChildUser(null);
    setAccountToken(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
  }, []);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      const updated = await authApi.updateProfile(payload);
      // Met à jour l'identité active (parent ou enfant).
      setChildUser((c) => (c ? updated : c));
      setAccount((a) => (childUser ? a : updated));
      return updated;
    },
    [childUser],
  );

  const refresh = useCallback(async () => {
    const me = await authApi.me();
    if (childUser) setChildUser(me);
    else setAccount(me);
  }, [childUser]);

  /** Le parent « entre » dans l'app au nom d'un enfant (jeton dédié en mémoire). */
  const enterAsChild = useCallback(async (childId: string) => {
    const res = await childrenApi.token(childId);
    setAuthToken(res.accessToken); // jeton enfant (non persisté : le parent reste le compte enregistré)
    setChildUser(res.user);
  }, []);

  /** Retour au compte parent. */
  const exitToParent = useCallback(() => {
    setAuthToken(accountToken);
    setChildUser(null);
  }, [accountToken]);

  const value = useMemo<SessionContextValue>(
    () => ({
      user: childUser ?? account,
      account,
      isLoading,
      isAuthenticated: !!account,
      isChildActive: !!childUser,
      register,
      login,
      logout,
      updateProfile,
      refresh,
      enterAsChild,
      exitToParent,
    }),
    [childUser, account, isLoading, register, login, logout, updateProfile, refresh, enterAsChild, exitToParent],
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
