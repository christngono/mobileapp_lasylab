import type { AuthResponseDTO, ChildDTO } from '@lasylab/shared';
import { apiRequest } from './client';

export const childrenApi = {
  list() {
    return apiRequest<ChildDTO[]>('/users/children');
  },
  create(name: string, classe?: string) {
    return apiRequest<ChildDTO>('/users/children', {
      method: 'POST',
      body: { name, classe },
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/users/children/${id}`, { method: 'DELETE' });
  },
  token(id: string) {
    return apiRequest<AuthResponseDTO>(`/users/children/${id}/token`, { method: 'POST' });
  },
};
