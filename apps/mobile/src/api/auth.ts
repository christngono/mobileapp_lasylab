import type {
  AuthResponseDTO,
  LoginDTO,
  RegisterDTO,
  UserDTO,
} from '@lasylab/shared';
import { apiRequest } from './client';

export interface UpdateProfilePayload {
  name?: string;
  firstName?: string;
  classe?: string;
  birthYear?: number;
  school?: string;
  objectifs?: string[];
  classes?: string[];
  subjects?: string[];
  schools?: string[];
}

export const authApi = {
  register(payload: RegisterDTO) {
    return apiRequest<AuthResponseDTO>('/auth/register', {
      method: 'POST',
      body: payload,
      anonymous: true,
    });
  },

  login(payload: LoginDTO) {
    return apiRequest<AuthResponseDTO>('/auth/login', {
      method: 'POST',
      body: payload,
      anonymous: true,
    });
  },

  me() {
    return apiRequest<UserDTO>('/auth/me');
  },

  updateProfile(payload: UpdateProfilePayload) {
    return apiRequest<UserDTO>('/users/me', { method: 'PATCH', body: payload });
  },
};
