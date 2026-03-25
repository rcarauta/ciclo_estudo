import React from 'react';
import { 
  RefreshCw, 
  Clock, 
  Zap,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Play,
  Pause
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useStudy } from '../StudyContext';
import { toast } from 'sonner';

export default function StudyCycle() {
  const { data, reformulateCycle, startSession } = useStudy();

  const handleRebalance = () => {
    reformulateCycle();
    toast.success('Ciclo rebalanceado com sucesso!', {
      description: 'O algoritmo priorizou as matérias com maior taxa de erro e menor progresso.'
    });
  };

  const getPerformanceColor = (correct: number, total: number) => {
    if (total === 0) return 'text-secondary';
    const rate = (correct / total) * 100;
    if (rate >= 80) return 'text-green-500';
    if (rate >= 65) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSubjectPerformance = (subjectId: string) => {
    const subject = data.subjects.find(s => s.id === subjectId);
    if (!subject) return { correct: 0, total: 0, rate: 0 };
    
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

    return {
      correct,
      total,
      rate: total > 0 ? Math.round((correct / total) * 100) : 0
    };
  };

  const calculateMastery = (subjectId: string) => {
    const subject = data.subjects.find(s => s.id === subjectId);
    if (!subject || subject.topics.length === 0) return 0;
    const studied = subject.topics.filter(t => t.status === 'studied').length;
    return Math.round((studied / subject.topics.length) * 100);
  };

  const cycleItems = (data.cycle || []).length > 0 
    ? data.cycle.map(item => {
        const subject = data.subjects.find(s => s.id === item.subjectId);
        const mastery = calculateMastery(item.subjectId);
        const performance = getSubjectPerformance(item.subjectId);
        return {
          id: item.subjectId,
          name: subject?.title || 'Unknown Subject',
          progress: mastery,
          time: `${item.weight}m`,
          performance: performance,
          status: mastery === 100 ? 'completed' : 
                  mastery > 0 ? 'active' : 'pending'
        };
      })
    : data.subjects.map((subject, i) => {
        const mastery = calculateMastery(subject.id);
        const performance = getSubjectPerformance(subject.id);
        return {
          id: subject.id,
          name: subject.title,
          progress: mastery,
          time: "60m",
          performance: performance,
          status: mastery === 100 ? 'completed' : 
                  mastery > 0 ? 'active' : 'pending'
        };
      });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-10"
    >
      <section className="flex justify-between items-end">
        <div>
          <p className="text-secondary font-label uppercase tracking-[0.08em] text-xs mb-2">Adaptive Methodology</p>
          <h2 className="text-4xl font-extrabold font-headline text-on-surface leading-tight tracking-tight">
            Dynamic <span className="text-primary">Study Cycle</span>
          </h2>
        </div>
        <button 
          onClick={handleRebalance}
          className="flex items-center gap-2 px-6 py-3 bg-surface-container-highest rounded-xl text-sm font-bold hover:bg-surface-container-high transition-all"
        >
          <RefreshCw size={18} className="text-primary" />
          Rebalance Cycle
        </button>
      </section>

      {data.subjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <RefreshCw size={120} />
              </div>
              <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-3">
                Current Sequence
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] rounded-full uppercase tracking-widest">Active</span>
              </h3>
              
              <div className="space-y-4">
                {cycleItems.map((item, i) => (
                  <div key={item.id} className="flex items-center gap-6 group">
                    <div className="flex flex-col items-center gap-2">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all",
                        item.status === 'completed' ? "bg-green-500 text-white" : 
                        item.status === 'active' ? "bg-primary text-white scale-110 shadow-lg" : 
                        "bg-surface-container-high text-secondary"
                      )}>
                        {item.status === 'completed' ? <CheckCircle2 size={20} /> : i + 1}
                      </div>
                      {i < cycleItems.length - 1 && <div className="w-0.5 h-12 bg-surface-container-high"></div>}
                    </div>
                    
                    <div className={cn(
                      "flex-1 p-5 rounded-xl border transition-all flex items-center justify-between",
                      item.status === 'active' ? "bg-primary/5 border-primary/20" : "bg-surface-container-low border-transparent"
                    )}>
                      <div>
                        <h4 className="font-bold text-on-surface">{item.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-secondary uppercase">
                            <Clock size={12} /> {item.time}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
                            <Zap size={12} /> {item.progress}% Mastery
                          </span>
                          {item.performance.total > 0 && (
                            <span className={cn(
                              "flex items-center gap-1 text-[10px] font-bold uppercase",
                              getPerformanceColor(item.performance.correct, item.performance.total)
                            )}>
                              <BarChart3 size={12} /> {item.performance.rate}% Questions
                            </span>
                          )}
                        </div>
                      </div>
                      {item.status === 'active' && (
                        <button 
                          onClick={() => {
                            const subject = data.subjects.find(s => s.id === item.id);
                            const firstPendingTopic = subject?.topics.find(t => t.status !== 'studied');
                            if (firstPendingTopic) {
                              startSession(item.id, firstPendingTopic.id);
                            }
                          }}
                          className="bg-primary text-white p-2 rounded-lg shadow-md hover:scale-110 transition-transform"
                        >
                          <Play size={18} fill="currentColor" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
              <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-3">
                <BarChart3 size={20} className="text-primary" />
                Efficiency Comparison
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="text-secondary">Morning Focus</span>
                    <span className="text-on-surface">92%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="text-secondary">Evening Focus</span>
                    <span className="text-on-surface">64%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary/40" style={{ width: '64%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <span className="font-bold text-primary">Insight:</span> You are <span className="font-bold">28% more efficient</span> during morning sessions. The algorithm has prioritized complex Law subjects for your 8 AM slots.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
              <h3 className="font-headline font-bold text-lg mb-4">Upcoming Milestone</h3>
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-black">
                  15
                </div>
                <div>
                  <h4 className="font-bold text-sm">General Mock Test</h4>
                  <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">In 3 days</p>
                </div>
                <ArrowRight size={18} className="ml-auto text-secondary" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl p-20 text-center border-2 border-dashed border-outline-variant/30">
          <h3 className="text-2xl font-bold font-headline mb-2">No study cycle defined</h3>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Import your syllabus to automatically generate an optimized study cycle based on subject complexity.
          </p>
        </div>
      )}
    </motion.div>
  );
}
