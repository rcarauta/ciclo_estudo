import React from 'react';
import { 
  BookOpen, 
  Calculator, 
  History, 
  Rocket, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  Verified
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useStudy } from '../StudyContext';

export default function Dashboard() {
  const { data } = useStudy();

  const totalTopics = data.subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const studiedTopics = data.subjects.reduce((acc, s) => acc + s.topics.filter(t => t.status === 'studied').length, 0);
  const mastery = totalTopics > 0 ? Math.round((studiedTopics / totalTopics) * 100) : 0;

  const studyData = [
    { day: 'Mon', hours: 4 },
    { day: 'Tue', hours: 6 },
    { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 7 },
    { day: 'Fri', hours: 5 },
    { day: 'Sat', hours: 2 },
    { day: 'Sun', hours: 1.5 },
  ];

  const recentSubjects = data.subjects.slice(0, 3);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Intellectual Dashboard</h2>
          <p className="text-secondary mt-1 font-medium italic">"The secret of getting ahead is getting started."</p>
        </div>
        <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-bold text-on-surface-variant">Session Active: 01:45:22</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Progress Ring Card */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-4xl shadow-[0_20px_40px_rgba(25,28,30,0.04)] flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-surface-tint to-primary"></div>
          <h3 className="text-on-surface-variant text-xs font-black uppercase tracking-[0.2em] mb-8">Curriculum Mastery</h3>
          
          <div className="relative w-48 h-48 mb-6">
            <svg className="focus-ring-svg w-full h-full" viewBox="0 0 100 100">
              <circle 
                className="text-surface-container-highest" 
                cx="50" cy="50" r="42" 
                fill="transparent" 
                stroke="currentColor" 
                strokeWidth="8" 
              />
              <circle 
                className="text-primary transition-all duration-1000" 
                cx="50" cy="50" r="42" 
                fill="transparent" 
                stroke="currentColor" 
                strokeWidth="8" 
                strokeDasharray="263.89" 
                strokeDashoffset={263.89 - (263.89 * mastery / 100)} 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-headline text-on-surface">{mastery}%</span>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">Completed</span>
            </div>
          </div>
          
          <p className="text-sm text-center text-on-surface-variant px-4 leading-relaxed">
            You've completed <span className="font-bold text-primary">{studiedTopics}/{totalTopics}</span> topics in the current edital.
          </p>
        </div>

        {/* Study Hours Summary */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-4xl shadow-[0_20px_40px_rgba(25,28,30,0.04)]">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-on-surface font-bold text-xl font-headline">Study Hours Summary</h3>
              <p className="text-secondary text-sm">Consistent growth over the last week</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-surface-container-low text-xs font-bold rounded-full text-secondary">Week</span>
              <span className="px-3 py-1 bg-primary text-xs font-bold rounded-full text-white">Month</span>
            </div>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyData}>
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 rounded-lg shadow-lg border border-surface-container-high text-xs font-bold">
                          {payload[0].value} hours
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                  {studyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.day === 'Thu' ? '#1f108e' : 'rgba(31, 16, 142, 0.1)'} 
                    />
                  ))}
                </Bar>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#505f76' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Cycle */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold font-headline text-on-surface">Active Cycle: Phase B</h3>
            <button className="text-primary text-sm font-bold flex items-center gap-1">
              View Full Map <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {data.subjects.length === 0 ? (
              <div className="bg-surface-container-lowest p-10 rounded-2xl text-center border border-dashed border-outline-variant">
                <p className="text-secondary font-medium">No subjects imported yet.</p>
              </div>
            ) : (
              data.subjects.slice(0, 3).map((subject, idx) => (
                <div key={subject.id} className={cn(
                  "bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex items-center gap-6 relative",
                  idx === 0 && "border-l-4 border-surface-tint"
                )}>
                  {idx === 0 && <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Studying Now</div>}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {idx === 0 ? <BookOpen size={28} /> : idx === 1 ? <Calculator size={28} /> : <History size={28} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{subject.title}</h4>
                    <p className="text-sm text-secondary">{subject.topics[0]?.title || "No topics"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-secondary font-bold uppercase tracking-widest mb-1">{idx === 0 ? "Time Left" : "Duration"}</p>
                    <p className="text-xl font-headline font-black text-on-surface">{idx === 0 ? "45:00" : "60m"}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-4xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-white/60 text-xs font-black uppercase tracking-[0.2em] mb-2">Success Rate</p>
                <h3 className="text-5xl font-extrabold font-headline mb-4">
                  {data.mockTests.length > 0 
                    ? Math.round(data.mockTests.reduce((acc, t) => acc + (t.correct / t.total), 0) / data.mockTests.length * 100)
                    : 0}%
                </h3>
              </div>
              <Verified size={48} className="opacity-30" />
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <span className="bg-green-400 text-primary-container text-[10px] font-black px-2 py-0.5 rounded-full">+2.4%</span>
              <span className="text-white/60 text-xs font-medium">Since last assessment</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-4xl shadow-sm">
            <h3 className="text-on-surface font-bold text-xl font-headline mb-6">Performance by Subject</h3>
            <div className="space-y-6">
              {data.subjects.length === 0 ? (
                <p className="text-sm text-secondary text-center">No data available.</p>
              ) : (
                data.subjects.slice(0, 4).map((subject) => {
                  const progress = Math.round((subject.topics.filter(t => t.status === 'studied').length / subject.topics.length) * 100) || 0;
                  return (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">{subject.title}</span>
                        <span className={cn("text-sm font-extrabold", progress > 80 ? 'text-green-600' : progress > 60 ? 'text-yellow-600' : 'text-red-600')}>
                          {progress}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-1000", progress > 80 ? 'bg-green-500' : progress > 60 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-surface-container-highest/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Rocket size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Ready for a Mock Test?</p>
                <p className="text-xs text-secondary">Improve your scores today</p>
              </div>
            </div>
            <button className="bg-white text-primary text-xs font-black px-4 py-2 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all">
              TAKE TEST
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
