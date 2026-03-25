import React, { useRef, useState } from 'react';
import { 
  Upload, 
  Download, 
  Maximize2, 
  CheckCircle2, 
  Circle, 
  History, 
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Search,
  Timer,
  Play,
  Trash2,
  Target,
  Check,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useStudy } from '../StudyContext';
import { Status, QuestionData } from '../types';

export const getPerformanceColor = (correct: number, total: number) => {
  if (total === 0) return 'text-zinc-400 bg-zinc-100';
  const rate = (correct / total) * 100;
  if (rate >= 80) return 'text-green-700 bg-green-100';
  if (rate >= 65) return 'text-yellow-700 bg-yellow-100';
  return 'text-red-700 bg-red-100';
};

export default function EditalVertical() {
  const { 
    data, 
    importSyllabus, 
    updateTopicStatus, 
    updateSubTopicStatus, 
    updateTopicQuestions,
    updateSubTopicQuestions,
    clearAllData,
    activeSession,
    startSession
  } = useStudy();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [editingQuestions, setEditingQuestions] = useState<{sid: string, tid: string, stid?: string} | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        importSyllabus(text);
      };
      reader.readAsText(file);
    }
  };

  const toggleSubject = (id: string) => {
    setExpandedSubjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTopic = (id: string) => {
    setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calculateSubjectProgress = (subjectId: string) => {
    const subject = data.subjects.find(s => s.id === subjectId);
    if (!subject || subject.topics.length === 0) return 0;
    
    const totalTopics = subject.topics.length;
    const studiedTopics = subject.topics.filter(t => t.status === 'studied').length;
    return Math.round((studiedTopics / totalTopics) * 100);
  };

  const globalProgress = data.subjects.length > 0 
    ? Math.round(data.subjects.reduce((acc, s) => acc + calculateSubjectProgress(s.id), 0) / data.subjects.length)
    : 0;

  const QuestionEditor = ({ sid, tid, stid, current }: { sid: string, tid: string, stid?: string, current?: QuestionData }) => {
    const [total, setTotal] = useState(current?.total || 0);
    const [correct, setCorrect] = useState(current?.correct || 0);

    const handleSave = () => {
      const questions: QuestionData = {
        total,
        correct,
        incorrect: Math.max(0, total - correct)
      };
      if (stid) {
        updateSubTopicQuestions(sid, tid, stid, questions);
      } else {
        updateTopicQuestions(sid, tid, questions);
      }
      setEditingQuestions(null);
    };

    return (
      <div className="flex items-center gap-2 bg-surface-container-high p-2 rounded-xl border border-outline-variant/30 mt-2">
        <div className="flex flex-col">
          <label className="text-[10px] uppercase font-bold text-secondary">Total</label>
          <input 
            type="number" 
            value={total} 
            onChange={(e) => setTotal(parseInt(e.target.value) || 0)}
            className="w-16 bg-surface-container-lowest border-none rounded px-2 py-1 text-xs font-bold"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] uppercase font-bold text-secondary">Acertos</label>
          <input 
            type="number" 
            value={correct} 
            onChange={(e) => setCorrect(parseInt(e.target.value) || 0)}
            className="w-16 bg-surface-container-lowest border-none rounded px-2 py-1 text-xs font-bold"
          />
        </div>
        <div className="flex items-center gap-1 ml-2 self-end">
          <button onClick={handleSave} className="p-1.5 bg-primary text-white rounded-lg hover:opacity-90"><Check size={14} /></button>
          <button onClick={() => setEditingQuestions(null)} className="p-1.5 bg-surface-container-highest text-on-surface-variant rounded-lg hover:bg-outline-variant/30"><X size={14} /></button>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <header>
        <div className="flex items-end justify-between">
          <div>
            <nav className="flex gap-2 text-xs font-bold text-secondary uppercase tracking-[0.1em] mb-2">
              <span>Exams</span>
              <span className="text-outline-variant">/</span>
              <span className="text-primary">Current Edital</span>
            </nav>
            <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Edital Verticalizado</h2>
            <p className="text-on-surface-variant mt-2 max-w-2xl">Manage your progress across the hierarchical content of the official exam syllabus. Use the status indicators to track your deep work sessions.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Global Progress</span>
            <div className="flex items-center gap-4">
              <div className="w-64 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${globalProgress}%` }}></div>
              </div>
              <span className="text-2xl font-black font-headline text-primary">{globalProgress}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 lg:col-span-6 flex gap-4">
          <button className="bg-surface-container-lowest px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold text-primary border border-primary/20">
            All Topics
          </button>
        </div>
        <div className="col-span-12 lg:col-span-6 flex justify-end gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".txt"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary text-white font-bold px-5 py-2 rounded-xl text-sm flex items-center gap-2 shadow-md hover:opacity-90 transition-all"
          >
            <Upload size={18} />
            Importar Edital (.txt)
          </button>
          <button 
            onClick={clearAllData}
            className="bg-error-container text-on-error-container font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2"
          >
            <Trash2 size={18} />
            Limpar Tudo
          </button>
        </div>
      </div>

      <section className="space-y-6">
        {data.subjects.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-3xl p-20 text-center border-2 border-dashed border-outline-variant/30">
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6 text-on-surface-variant">
              <Upload size={40} />
            </div>
            <h3 className="text-2xl font-bold font-headline mb-2">No syllabus imported</h3>
            <p className="text-on-surface-variant max-w-md mx-auto mb-8">
              Import a .txt file with your exam content. Use the format:
              <br />
              <code className="bg-surface-container-high px-2 py-1 rounded mt-2 block text-xs">
                1. Subject Name<br />
                1.1 Topic Name<br />
                1.1.1 Subtopic Name
              </code>
            </p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-primary/20"
            >
              Import Now
            </button>
          </div>
        ) : (
          data.subjects.map((subject) => (
            <div key={subject.id} className="bg-surface-container-lowest rounded-xl p-1 shadow-sm overflow-hidden">
              <div 
                className="flex items-center justify-between p-6 bg-surface-container-low/30 cursor-pointer"
                onClick={() => toggleSubject(subject.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xl font-headline">
                    {subject.id}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-headline text-on-surface">{subject.title}</h3>
                    <p className="text-sm text-on-surface-variant">{subject.topics.length} topics found</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="block text-xs font-bold text-on-surface-variant uppercase">Completion</span>
                    <span className="text-lg font-bold text-primary">{calculateSubjectProgress(subject.id)}%</span>
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={cn("text-on-surface-variant transition-transform", expandedSubjects[subject.id] && "rotate-180")} 
                  />
                </div>
              </div>
              
              {expandedSubjects[subject.id] && (
                <div className="p-6 pt-0 ml-16 space-y-4">
                  {subject.topics.map((topic) => (
                    <div key={topic.id} className="relative pl-6 py-3 border-l-2 border-surface-container-highest">
                      <div className="flex items-center justify-between group">
                        <div 
                          className="flex flex-col gap-1 cursor-pointer"
                          onClick={() => toggleTopic(topic.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "text-sm font-bold font-headline",
                              topic.status === 'studied' ? "text-green-600" : "text-secondary"
                            )}>{topic.id}</span>
                            <h4 className="text-base font-semibold text-on-surface">{topic.title}</h4>
                            {topic.subTopics.length > 0 && (
                              <ChevronRight size={14} className={cn("text-secondary transition-transform", expandedTopics[topic.id] && "rotate-90")} />
                            )}
                          </div>
                          {topic.questions && topic.questions.total > 0 && (
                            <div className={cn(
                              "text-[10px] font-black px-2 py-0.5 rounded-full w-fit flex items-center gap-1",
                              getPerformanceColor(topic.questions.correct, topic.questions.total)
                            )}>
                              <Target size={10} />
                              {topic.questions.correct}/{topic.questions.total} ({Math.round((topic.questions.correct / topic.questions.total) * 100)}%)
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingQuestions({sid: subject.id, tid: topic.id});
                            }}
                            className="p-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-white transition-colors"
                            title="Add Questions"
                          >
                            <Target size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startSession(subject.id, topic.id);
                            }}
                            disabled={!!activeSession}
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              activeSession?.topicId === topic.id 
                                ? "bg-primary text-white" 
                                : "bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-surface-container-high disabled:hover:text-on-surface-variant"
                            )}
                            title="Start Study Session"
                          >
                            <Play size={14} className="fill-current" />
                          </button>
                          <select 
                            value={topic.status}
                            onChange={(e) => updateTopicStatus(subject.id, topic.id, e.target.value as Status)}
                            className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border-none focus:ring-0 cursor-pointer",
                              topic.status === 'studied' ? 'bg-green-100 text-green-700' : 
                              topic.status === 'in-progress' ? 'bg-primary/10 text-primary' : 
                              'bg-surface-container-high text-on-surface-variant'
                            )}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="studied">Studied</option>
                          </select>
                          {topic.status === 'studied' && <CheckCircle2 size={18} className="text-green-600" />}
                        </div>
                      </div>

                      {editingQuestions?.sid === subject.id && editingQuestions?.tid === topic.id && !editingQuestions.stid && (
                        <QuestionEditor sid={subject.id} tid={topic.id} current={topic.questions} />
                      )}

                      {expandedTopics[topic.id] && topic.subTopics.length > 0 && (
                        <div className="mt-4 space-y-3 ml-8">
                          {topic.subTopics.map((subTopic) => (
                            <div key={subTopic.id} className="flex flex-col gap-2 p-3 rounded-xl hover:bg-surface-container-low transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-secondary">{subTopic.id}</span>
                                    <span className="text-sm text-on-surface">{subTopic.title}</span>
                                  </div>
                                  {subTopic.questions && subTopic.questions.total > 0 && (
                                    <div className={cn(
                                      "text-[9px] font-black px-2 py-0.5 rounded-full w-fit flex items-center gap-1",
                                      getPerformanceColor(subTopic.questions.correct, subTopic.questions.total)
                                    )}>
                                      <Target size={10} />
                                      {subTopic.questions.correct}/{subTopic.questions.total} ({Math.round((subTopic.questions.correct / subTopic.questions.total) * 100)}%)
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => setEditingQuestions({sid: subject.id, tid: topic.id, stid: subTopic.id})}
                                    className="p-1 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-white transition-colors"
                                    title="Add Questions"
                                  >
                                    <Target size={12} />
                                  </button>
                                  <select 
                                    value={subTopic.status}
                                    onChange={(e) => updateSubTopicStatus(subject.id, topic.id, subTopic.id, e.target.value as Status)}
                                    className={cn(
                                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border-none focus:ring-0 cursor-pointer",
                                      subTopic.status === 'studied' ? 'bg-green-100 text-green-700' : 
                                      subTopic.status === 'in-progress' ? 'bg-primary/10 text-primary' : 
                                      'bg-surface-container-high text-on-surface-variant'
                                    )}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="studied">Studied</option>
                                  </select>
                                  {subTopic.status === 'studied' ? (
                                    <CheckCircle2 size={16} className="text-green-600" />
                                  ) : (
                                    <Circle size={16} className="text-outline-variant" />
                                  )}
                                </div>
                              </div>
                              {editingQuestions?.sid === subject.id && editingQuestions?.tid === topic.id && editingQuestions.stid === subTopic.id && (
                                <QuestionEditor sid={subject.id} tid={topic.id} stid={subTopic.id} current={subTopic.questions} />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </motion.div>
  );
}
