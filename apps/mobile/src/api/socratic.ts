import type {
  SocraticReplyDTO,
  SocraticSessionDTO,
  SubjectId,
} from '@lasylab/shared';
import { apiRequest } from './client';

export const socraticApi = {
  ask(message: string, opts: { sessionId?: string; subjectId?: SubjectId } = {}) {
    return apiRequest<SocraticReplyDTO>('/socratic/ask', {
      method: 'POST',
      body: { message, sessionId: opts.sessionId, subjectId: opts.subjectId },
    });
  },
  sessions() {
    return apiRequest<SocraticSessionDTO[]>('/socratic/sessions');
  },
  session(id: string) {
    return apiRequest<SocraticSessionDTO>(`/socratic/sessions/${id}`);
  },
};
