import React from 'react';
import { 
  Trophy, 
  Calendar, 
  ChevronRight,
  Plus,
  BarChart,
  Target,
  History,
  X,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useStudy } from '../StudyContext';

export default function MockTests() {
  const { data, addMockTest } = useStudy();
  const [isAddingTest, setIsAddingTest] = React.useState(false);
  const [newTest, setNewTest] = React.useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    score: 0,
    totalQuestions: 100,
    correct: 0,
    incorrect: 0
  });

  const overallAccuracy = data.mockTests.length > 0
    ? Math.round(data.mockTests.reduce((acc, test) => acc + test.accuracy, 0) / data.mockTests.length)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const accuracy = Math.round((newTest.correct / newTest.totalQuestions) * 100);
    addMockTest({
      ...newTest,
      accuracy
    });
    setIsAddingTest(false);
    setNewTest({
      title: '',
      date: new Date().toISOString().split('T')[0],
      score: 0,
      totalQuestions: 100,
      correct: 0,
      incorrect: 0
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <section className="flex justify-between items-end">
        <div>
          <p className="text-secondary font-label uppercase tracking-[0.08em] text-xs mb-2">Simulated Assessment</p>
          <h2 className="text-4xl font-extrabold font-headline text-on-surface leading-tight tracking-tight">
            Mock Tests <span className="text-surface-tint">&amp;</span> Accuracy
          </h2>
        </div>
        <button 
          onClick={() => setIsAddingTest(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={18} />
          New Mock Test
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-b-4 border-primary">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Trophy size={20} />
            </div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-secondary">Overall Accuracy</h4>
          </div>
          <p className="text-3xl font-black font-headline">{overallAccuracy}%</p>
          <p className="text-[10px] text-secondary mt-2">Based on {data.mockTests.length} completed tests.</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-b-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
              <Target size={20} />
            </div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-secondary">Best Score</h4>
          </div>
          <p className="text-3xl font-black font-headline">
            {data.mockTests.length > 0 ? Math.max(...data.mockTests.map(t => t.accuracy)) : 0}%
          </p>
          <p className="text-[10px] text-secondary mt-2">Highest performance achieved.</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-b-4 border-yellow-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-600">
              <BarChart size={20} />
            </div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-secondary">Avg. Questions</h4>
          </div>
          <p className="text-3xl font-black font-headline">
            {data.mockTests.length > 0 ? Math.round(data.mockTests.reduce((acc, t) => acc + t.totalQuestions, 0) / data.mockTests.length) : 0}
          </p>
          <p className="text-[10px] text-secondary mt-2">Per simulation session.</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-b-4 border-secondary">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary">
              <History size={20} />
            </div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-secondary">Last Test</h4>
          </div>
          <p className="text-3xl font-black font-headline">
            {data.mockTests.length > 0 ? data.mockTests[data.mockTests.length - 1].accuracy : 0}%
          </p>
          <p className="text-[10px] text-secondary mt-2">
            {data.mockTests.length > 0 ? data.mockTests[data.mockTests.length - 1].date : "No tests yet."}
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-surface-container-high flex justify-between items-center">
          <h3 className="font-headline font-bold text-xl">Test History</h3>
          <div className="flex gap-4">
            <select className="bg-surface-container-low text-xs font-bold px-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-primary">
              <option>All Subjects</option>
              {data.subjects.map(s => <option key={s.id}>{s.title}</option>)}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.08em] font-label">Mock Test Name</th>
                <th className="px-6 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.08em] font-label text-center">Date</th>
                <th className="px-6 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.08em] font-label text-center">Questions</th>
                <th className="px-6 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.08em] font-label text-center">Correct</th>
                <th className="px-6 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.08em] font-label text-center">Incorrect</th>
                <th className="px-8 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.08em] font-label text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {data.mockTests.length > 0 ? (
                data.mockTests.map((test) => (
                  <tr key={test.id} className="hover:bg-surface-container-high transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <FileText size={14} />
                        </div>
                        <span className="font-bold text-sm text-on-surface">{test.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center text-xs font-medium text-secondary">{test.date}</td>
                    <td className="px-6 py-5 text-center text-sm font-medium text-on-surface">{test.totalQuestions}</td>
                    <td className="px-6 py-5 text-center text-sm font-bold text-green-600">{test.correct}</td>
                    <td className="px-6 py-5 text-center text-sm font-bold text-red-600">{test.incorrect}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className={cn(
                          "px-3 py-1 rounded-full font-black text-xs",
                          test.accuracy >= 80 ? 'bg-green-100 text-green-700' : 
                          test.accuracy >= 60 ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        )}>
                          {test.accuracy}%
                        </span>
                        <ChevronRight size={16} className="text-outline-variant group-hover:translate-x-1 transition-transform" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-on-surface-variant italic">
                    No mock tests recorded yet. Click "New Mock Test" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isAddingTest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-8 py-6 bg-primary text-white flex justify-between items-center">
                <h3 className="text-xl font-bold font-headline">Record Mock Test</h3>
                <button onClick={() => setIsAddingTest(false)} className="hover:rotate-90 transition-transform">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary">Test Title</label>
                  <input 
                    required
                    type="text" 
                    value={newTest.title}
                    onChange={e => setNewTest({...newTest, title: e.target.value})}
                    placeholder="e.g., General Simulation #1"
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary">Date</label>
                    <input 
                      required
                      type="date" 
                      value={newTest.date}
                      onChange={e => setNewTest({...newTest, date: e.target.value})}
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary">Total Questions</label>
                    <input 
                      required
                      type="number" 
                      value={newTest.totalQuestions}
                      onChange={e => setNewTest({...newTest, totalQuestions: parseInt(e.target.value) || 0})}
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary">Correct Answers</label>
                    <input 
                      required
                      type="number" 
                      value={newTest.correct}
                      onChange={e => setNewTest({...newTest, correct: parseInt(e.target.value) || 0})}
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary">Incorrect Answers</label>
                    <input 
                      required
                      type="number" 
                      value={newTest.incorrect}
                      onChange={e => setNewTest({...newTest, incorrect: parseInt(e.target.value) || 0})}
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                  >
                    Save Test Results
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
