export type View = 'dashboard' | 'edital' | 'performance' | 'cycle' | 'mock-tests' | 'settings' | 'support';

export type Status = 'pending' | 'in-progress' | 'studied';

export interface QuestionData {
  total: number;
  correct: number;
  incorrect: number;
}

export interface SubTopic {
  id: string;
  title: string;
  status: Status;
  lastStudied?: string;
  questions?: QuestionData;
}

export interface Topic {
  id: string;
  title: string;
  status: Status;
  subTopics: SubTopic[];
  questions?: QuestionData;
}

export interface Subject {
  id: string;
  title: string;
  topics: Topic[];
}

export interface MockTest {
  id: string;
  name: string;
  date: string;
  correct: number;
  total: number;
  subjectId?: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  topicId: string;
  startTime: string;
  duration: number; // in minutes
}

export interface StudyCycleItem {
  subjectId: string;
  weight: number; // minutes or priority
}

export interface StudyData {
  subjects: Subject[];
  mockTests: MockTest[];
  sessions: StudySession[];
  cycle: StudyCycleItem[];
}
