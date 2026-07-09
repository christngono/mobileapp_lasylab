import type {
  ActivityDTO,
  LessonDTO,
  ParcoursDTO,
  ProgressDTO,
  QuizDTO,
  QuizResultDTO,
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

export const quizApi = {
  get(subjectId: SubjectId, nodeIndex: number) {
    return apiRequest<QuizDTO>(`/quiz/${subjectId}/${nodeIndex}`);
  },
  submit(subjectId: SubjectId, nodeIndex: number, answers: number[]) {
    return apiRequest<QuizResultDTO>('/quiz/submit', {
      method: 'POST',
      body: { subjectId, nodeIndex, answers },
    });
  },
};

export const activitiesApi = {
  list() {
    return apiRequest<ActivityDTO[]>('/activities');
  },
  get(id: string) {
    return apiRequest<ActivityDTO>(`/activities/${id}`);
  },
};
