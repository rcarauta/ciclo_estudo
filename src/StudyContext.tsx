import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudyData, Subject, Topic, SubTopic, Status, MockTest, StudySession, QuestionData, StudyCycleItem } from './types';

interface StudyContextType {
  data: StudyData;
  importSyllabus: (text: string) => void;
  updateTopicStatus: (subjectId: string, topicId: string, status: Status) => void;
  updateSubTopicStatus: (subjectId: string, topicId: string, subTopicId: string, status: Status) => void;
  updateTopicQuestions: (subjectId: string, topicId: string, questions: QuestionData) => void;
  updateSubTopicQuestions: (subjectId: string, topicId: string, subTopicId: string, questions: QuestionData) => void;
  addMockTest: (test: Omit<MockTest, 'id'>) => void;
  addSession: (session: Omit<StudySession, 'id'>) => void;
  clearAllData: () => void;
  reformulateCycle: () => void;
  activeSession: {
    startTime: number;
    subjectId: string;
    topicId: string;
    isPaused: boolean;
    accumulatedTime: number; // in seconds
  } | null;
  startSession: (subjectId: string, topicId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: (markAsStudied?: boolean) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const STORAGE_KEY = 'focused_curator_data';

const initialData: StudyData = {
  subjects: [],
  mockTests: [],
  sessions: [],
  cycle: [],
};

export const StudyProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<StudyData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialData,
        ...parsed,
        cycle: parsed.cycle || []
      };
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const importSyllabus = (text: string) => {
    // Split by double newlines to separate subjects
    const subjectBlocks = text.split(/\n\s*\n/).map(block => block.trim()).filter(block => block.length > 0);
    const subjects: Subject[] = [];

    subjectBlocks.forEach((block, index) => {
      const colonIndex = block.indexOf(':');
      if (colonIndex === -1) return;

      const subjectTitle = block.substring(0, colonIndex).trim();
      const content = block.substring(colonIndex + 1).trim();

      const currentSubject: Subject = {
        id: (index + 1).toString(),
        title: subjectTitle,
        topics: [],
      };

      // Regex to find numbered items: 1, 1.1, 1.1.1 etc.
      const itemRegex = /(?:^|\s)(\d+(?:\.\d+)*)\s+/g;
      const matches = [];
      let match;

      while ((match = itemRegex.exec(content)) !== null) {
        matches.push({
          id: match[1],
          index: match.index,
          fullMatch: match[0]
        });
      }

      let currentTopic: Topic | null = null;

      matches.forEach((m, i) => {
        const start = m.index + m.fullMatch.length;
        const end = i < matches.length - 1 ? matches[i + 1].index : content.length;
        const title = content.substring(start, end).trim().replace(/\.$/, '');

        const idParts = m.id.split('.');

        if (idParts.length === 1) {
          currentTopic = {
            id: m.id,
            title: title,
            status: 'pending',
            subTopics: [],
          };
          currentSubject.topics.push(currentTopic);
        } else {
          if (currentTopic) {
            currentTopic.subTopics.push({
              id: m.id,
              title: title,
              status: 'pending',
            });
          } else {
            currentTopic = {
              id: m.id,
              title: title,
              status: 'pending',
              subTopics: [],
            };
            currentSubject.topics.push(currentTopic);
          }
        }
      });

      if (currentSubject.topics.length > 0) {
        subjects.push(currentSubject);
      }
    });

    setData(prev => ({ ...prev, subjects }));
  };

  const updateTopicStatus = (subjectId: string, topicId: string, status: Status) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id !== topicId) return t;
            // If marking as studied, mark all subtopics as studied too
            const newSubTopics = status === 'studied' 
              ? t.subTopics.map(st => ({ ...st, status: 'studied' as Status }))
              : t.subTopics;
            return { ...t, status, subTopics: newSubTopics };
          })
        };
      })
    }));
  };

  const updateSubTopicStatus = (subjectId: string, topicId: string, subTopicId: string, status: Status) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id !== topicId) return t;
            const newSubTopics = t.subTopics.map(st => {
              if (st.id !== subTopicId) return st;
              return { ...st, status };
            });
            
            // Recalculate topic status based on subtopics
            let newTopicStatus: Status = 'pending';
            if (newSubTopics.every(st => st.status === 'studied')) {
              newTopicStatus = 'studied';
            } else if (newSubTopics.some(st => st.status === 'studied' || st.status === 'in-progress')) {
              newTopicStatus = 'in-progress';
            }

            return { ...t, subTopics: newSubTopics, status: newTopicStatus };
          })
        };
      })
    }));
  };

  const updateTopicQuestions = (subjectId: string, topicId: string, questions: QuestionData) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id !== topicId) return t;
            return { ...t, questions };
          })
        };
      })
    }));
  };

  const updateSubTopicQuestions = (subjectId: string, topicId: string, subTopicId: string, questions: QuestionData) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subTopics: t.subTopics.map(st => {
                if (st.id !== subTopicId) return st;
                return { ...st, questions };
              })
            };
          })
        };
      })
    }));
  };

  const addMockTest = (test: Omit<MockTest, 'id'>) => {
    setData(prev => ({
      ...prev,
      mockTests: [...prev.mockTests, { ...test, id: crypto.randomUUID() }]
    }));
  };

  const addSession = (session: Omit<StudySession, 'id'>) => {
    setData(prev => ({
      ...prev,
      sessions: [...prev.sessions, { ...session, id: crypto.randomUUID() }]
    }));
  };

  const reformulateCycle = () => {
    // Logic: Subjects with higher error rate get more weight
    const subjectPerformance = data.subjects.map(subject => {
      let total = 0;
      let correct = 0;
      
      subject.topics.forEach(topic => {
        if (topic.questions) {
          total += topic.questions.total;
          correct += topic.questions.correct;
        }
        topic.subTopics.forEach(sub => {
          if (sub.questions) {
            total += sub.questions.total;
            correct += sub.questions.correct;
          }
        });
      });

      const accuracy = total > 0 ? (correct / total) : 1; // 1 means no errors or no questions
      const errorRate = 1 - accuracy;
      
      return {
        subjectId: subject.id,
        errorRate: Math.max(0.1, errorRate) // Minimum weight of 0.1
      };
    });

    const totalErrorRate = subjectPerformance.reduce((acc, curr) => acc + curr.errorRate, 0);
    
    const newCycle: StudyCycleItem[] = subjectPerformance.map(perf => ({
      subjectId: perf.subjectId,
      weight: Math.round((perf.errorRate / totalErrorRate) * 120) // Distribute 120 minutes proportionally
    })).sort((a, b) => b.weight - a.weight);

    setData(prev => ({ ...prev, cycle: newCycle }));
  };

  const [activeSession, setActiveSession] = useState<{
    startTime: number;
    subjectId: string;
    topicId: string;
    isPaused: boolean;
    accumulatedTime: number;
  } | null>(null);

  const startSession = (subjectId: string, topicId: string) => {
    setActiveSession({
      startTime: Date.now(),
      subjectId,
      topicId,
      isPaused: false,
      accumulatedTime: 0
    });
  };

  const pauseSession = () => {
    setActiveSession(prev => {
      if (!prev || prev.isPaused) return prev;
      return {
        ...prev,
        isPaused: true,
        accumulatedTime: prev.accumulatedTime + Math.floor((Date.now() - prev.startTime) / 1000)
      };
    });
  };

  const resumeSession = () => {
    setActiveSession(prev => {
      if (!prev || !prev.isPaused) return prev;
      return {
        ...prev,
        isPaused: false,
        startTime: Date.now()
      };
    });
  };

  const endSession = (markAsStudied: boolean = true) => {
    if (!activeSession) return;
    
    let totalSeconds = activeSession.accumulatedTime;
    if (!activeSession.isPaused) {
      totalSeconds += Math.floor((Date.now() - activeSession.startTime) / 1000);
    }
    
    const durationMinutes = Math.floor(totalSeconds / 60);
    
    addSession({
      subjectId: activeSession.subjectId,
      topicId: activeSession.topicId,
      duration: durationMinutes,
      startTime: new Date(activeSession.startTime - (activeSession.accumulatedTime * 1000)).toISOString()
    });

    if (markAsStudied) {
      updateTopicStatus(activeSession.subjectId, activeSession.topicId, 'studied');
    }

    setActiveSession(null);
  };

  const clearAllData = () => {
    setData(initialData);
    setActiveSession(null);
  };

  return (
    <StudyContext.Provider value={{ 
      data, 
      importSyllabus, 
      updateTopicStatus, 
      updateSubTopicStatus, 
      updateTopicQuestions,
      updateSubTopicQuestions,
      addMockTest, 
      addSession,
      clearAllData,
      reformulateCycle,
      activeSession,
      startSession,
      pauseSession,
      resumeSession,
      endSession
    }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
