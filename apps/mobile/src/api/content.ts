import type {
  LessonDTO,
  ParcoursDTO,
  ProgressDTO,
  SubjectId,
  SubjectMeta,
} from '@lasylab/shared';
import { apiRequest } from './client';

export const subjectsApi = {
  list() {
    return apiRequest<SubjectMeta[]>('/subjects');
  },
};

export const progressApi = {
  get() {
    return apiRequest<ProgressDTO>('/progress/me');
  },
  complete(subjectId: SubjectId, nodeIndex: number) {
    return apiRequest<ProgressDTO>('/progress/complete', {
      method: 'POST',
      body: { subjectId, nodeIndex },
    });
  },
};

export const lessonsApi = {
  parcours(subjectId: SubjectId) {
    return apiRequest<ParcoursDTO>(`/parcours/${subjectId}`);
  },
  lesson(subjectId: SubjectId, nodeIndex: number) {
    return apiRequest<LessonDTO>(`/lessons/${subjectId}/${nodeIndex}`);
  },
};
