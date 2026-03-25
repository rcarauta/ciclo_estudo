import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  ExternalLink,
  Timer,
  Pause,
  Play,
  Target,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useStudy } from '../StudyContext';
import { getPerformanceColor } from './EditalVertical';

export default function Performance() {
  const { data } = useStudy();
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string | null>(
    data.subjects.length > 0 ? data.subjects[0].id : null
  );

  const selectedSubject = data.subjects.find(s => s.id === selectedSubjectId);

  const calculateMastery = (subjectId: string) => {
    const subject = data.subjects.find(s => s.id === subjectId);
    if (!subject || subject.topics.length === 0) return 0;
    const studied = subject.topics.filter(t => t.status === 'studied').length;
    return Math.round((studied / subject.topics.length) * 100);
  };

  const calculateQuestionPerformance = (subjectId: string) => {
    const subject = data.subjects.find(s => s.id === subjectId);
    if (!subject) return { total: 0, correct: 0, rate: 0 };
    
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
      total,
      correct,
      rate: total > 0 ? Math.round((correct / total) * 100) : 0
    };
  };

  const globalMastery = data.subjects.length > 0
    ? Math.round(data.subjects.reduce((acc, s) => acc + calculateMastery(s.id), 0) / data.subjects.length)
    : 0;

  const subjectPerf = selectedSubjectId ? calculateQuestionPerformance(selectedSubjectId) : { total: 0, correct: 0, rate: 0 };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <section className="grid grid-cols-12 gap-8 items-end">
        <div className="col-span-8">
          <p className="text-secondary font-label uppercase tracking-[0.08em] text-xs mb-2">Detailed Analytics</p>
          <h2 className="text-4xl font-extrabold font-headline text-on-surface leading-tight tracking-tight">
            Subject Mastery <span className="text-surface-tint">&amp;</span> Tactical Progress
          </h2>
        </div>
        <div className="col-span-4 flex justify-end">
          <div className="flex -space-x-3">
            <div className="w-12 h-12 rounded-full border-4 border-surface bg-primary text-white flex items-center justify-center font-bold text-xs">{globalMastery}%</div>
            <div className="w-12 h-12 rounded-full border-4 border-surface bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-xs">{data.sessions.length}s</div>
            <div className="w-12 h-12 rounded-full border-4 border-surface bg-error-container text-on-error-container flex items-center justify-center font-bold text-xs">🔥</div>
          </div>
        </div>
      </section>

      {data.subjects.length > 0 ? (
        <>
          <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-full w-fit overflow-x-auto max-w-full">
            {data.subjects.map((subject) => (
              <button 
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm transition-all whitespace-nowrap",
                  selectedSubjectId === subject.id ? "bg-primary text-white font-bold shadow-sm" : "text-secondary hover:text-primary font-medium"
                )}
              >
                {subject.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-surface-container-highest" cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8"></circle>
                    <circle 
                      className="text-primary transition-all duration-1000" 
                      cx="64" cy="64" r="56" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      strokeDasharray="351.8" 
                      strokeDashoffset={351.8 - (351.8 * (selectedSubjectId ? calculateMastery(selectedSubjectId) : 0) / 100)} 
                      strokeLinecap="round"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black font-headline">{selectedSubjectId ? calculateMastery(selectedSubjectId) : 0}%</span>
                    <span className="text-[10px] text-secondary uppercase tracking-widest font-bold">Mastery</span>
                  </div>
                </div>
                <h3 className="font-headline font-bold text-lg mb-1">{selectedSubject?.title}</h3>
                <p className="text-xs text-secondary text-center">Progress based on completed topics.</p>
              </div>

              <div className={cn(
                "p-6 rounded-xl shadow-sm border-l-4",
                subjectPerf.rate >= 80 ? "bg-green-50 border-green-500" : 
                subjectPerf.rate >= 65 ? "bg-yellow-50 border-yellow-500" : 
                "bg-red-50 border-red-500"
              )}>
                <div className="flex items-center gap-3 mb-2">
                  <Target className={cn(
                    subjectPerf.rate >= 80 ? "text-green-600" : 
                    subjectPerf.rate >= 65 ? "text-yellow-600" : 
                    "text-red-600"
                  )} size={20} />
                  <h4 className="font-bold text-sm uppercase tracking-wider font-headline text-on-surface">Questões</h4>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black font-headline text-on-surface">{subjectPerf.rate}%</span>
                  <span className="text-xs text-secondary mb-1">acerto global</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-secondary uppercase">Total</span>
                    <span className="text-lg font-bold text-on-surface">{subjectPerf.total}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-secondary uppercase">Acertos</span>
                    <span className="text-lg font-bold text-green-600">{subjectPerf.correct}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-8 py-6 flex justify-between items-center border-b border-surface-container-high/30">
                <h3 className="font-headline font-bold text-xl">{selectedSubject?.title}: Topic Breakdown</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      <th className="px-8 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.08em] font-label">Topic Name</th>
                      <th className="px-6 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.08em] font-label text-center">Status</th>
                      <th className="px-6 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.08em] font-label text-center">Questões</th>
                      <th className="px-8 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.08em] font-label text-right">Desempenho</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {selectedSubject?.topics.map((topic) => {
                      const topicTotal = topic.questions?.total || 0;
                      const topicCorrect = topic.questions?.correct || 0;
                      const topicRate = topicTotal > 0 ? Math.round((topicCorrect / topicTotal) * 100) : 0;
                      
                      return (
                        <tr key={topic.id} className="hover:bg-surface-container-high transition-colors group cursor-pointer">
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-on-surface">{topic.title}</span>
                              <span className="text-[10px] text-secondary">ID: {topic.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                              topic.status === 'studied' ? 'bg-green-100 text-green-700' : 
                              topic.status === 'in-progress' ? 'bg-primary/10 text-primary' : 
                              'bg-surface-container-high text-on-surface-variant'
                            )}>
                              {topic.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center text-sm font-medium text-on-surface">
                            <div className="flex flex-col items-center">
                              <span className="font-bold">{topicCorrect}/{topicTotal}</span>
                              <span className="text-[10px] text-secondary">acertos</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                                <div className={cn(
                                  "h-full transition-all",
                                  topicRate >= 80 ? "bg-green-500" : topicRate >= 65 ? "bg-yellow-500" : "bg-red-500"
                                )} style={{ width: `${topicRate}%` }}></div>
                              </div>
                              <span className={cn(
                                "text-sm font-black",
                                topicRate >= 80 ? "text-green-600" : topicRate >= 65 ? "text-yellow-600" : "text-red-600"
                              )}>{topicRate}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-surface-container-low/30 flex justify-between items-center mt-auto">
                <span className="text-xs text-secondary font-medium">Showing {selectedSubject?.topics.length} topics</span>
                <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                  View Complete Vertical Syllabus <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl p-20 text-center border-2 border-dashed border-outline-variant/30">
          <h3 className="text-2xl font-bold font-headline mb-2">No data to analyze</h3>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Import your syllabus in the Edital Vertical section to see your performance metrics here.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-primary">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={20} className="text-primary" />
            <h4 className="font-bold text-sm uppercase tracking-wider font-headline">Mastery Trend</h4>
          </div>
          <div className="h-24 flex items-end gap-1.5">
            {[30, 45, 40, 60, 85, 78, 95].map((h, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-full rounded-t-sm transition-all",
                  i < 4 ? "bg-surface-container-highest" : i < 6 ? "bg-primary/40" : "bg-primary"
                )} 
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <p className="text-[10px] text-secondary mt-4">Performance has improved by <span className="text-primary font-bold">12.4%</span> over the last 7 days.</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={20} className="text-red-500" />
            <h4 className="font-bold text-sm uppercase tracking-wider font-headline">Weakness Focus</h4>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
            {data.subjects.length > 0 
              ? "Analyze your mock tests to identify specific weaknesses."
              : "Import your syllabus to start tracking your progress."}
          </p>
          <button className="text-[10px] font-bold py-2 px-4 bg-error-container text-on-error-container rounded-lg w-full hover:bg-error/10 transition-colors">Generate Focus Quiz</button>
        </div>

        <div className="bg-primary-container p-6 rounded-xl shadow-md text-white flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider font-headline mb-2 opacity-80">Next Session</h4>
            <p className="text-lg font-black leading-tight">
              {data.subjects[0]?.topics.find(t => t.status !== 'studied')?.title || "All caught up!"}
            </p>
          </div>
          <button className="mt-4 bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-surface-container-lowest transition-colors">Start Prep Now</button>
        </div>
      </div>
    </motion.div>
  );
}
