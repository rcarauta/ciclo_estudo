import React, { useState, useEffect } from 'react';
import { useStudy } from '../StudyContext';
import { Timer as TimerIcon, StopCircle, Minimize2, Maximize2, X, Pause, Play, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Timer() {
  const { data, activeSession, endSession, pauseSession, resumeSession } = useStudy();
  const [elapsed, setElapsed] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const activeTopic = activeSession 
    ? data.subjects.find(s => s.id === activeSession.subjectId)
        ?.topics.find(t => t.id === activeSession.topicId)
    : null;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession) {
      if (!activeSession.isPaused) {
        interval = setInterval(() => {
          setElapsed(activeSession.accumulatedTime + Math.floor((Date.now() - activeSession.startTime) / 1000));
        }, 1000);
      } else {
        setElapsed(activeSession.accumulatedTime);
      }
    } else {
      setElapsed(0);
      setIsMinimized(false);
      setShowConfirm(false);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!activeSession) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          scale: isMinimized ? 0.9 : 1
        }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-8 right-8 z-[100]"
      >
        <div className={cn(
          "bg-zinc-900 text-white shadow-2xl border border-zinc-800 flex items-center transition-all duration-300 overflow-hidden",
          isMinimized ? "p-1 rounded-full w-14 h-14 justify-center" : "p-4 rounded-2xl min-w-[340px] gap-4"
        )}>
          <div 
            className={cn(
              "rounded-full flex items-center justify-center shrink-0 transition-all",
              activeSession.isPaused ? "bg-zinc-700 text-zinc-400" : "bg-orange-500/20 text-orange-500",
              isMinimized ? "w-12 h-12 cursor-pointer hover:bg-orange-500/30" : "w-10 h-10"
            )}
            onClick={() => isMinimized && setIsMinimized(false)}
            title={isMinimized ? "Expandir Timer" : "Sessão Ativa"}
          >
            <TimerIcon className={cn("w-5 h-5", !activeSession.isPaused && "animate-pulse", isMinimized && "w-6 h-6")} />
          </div>
          
          {!isMinimized && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium truncate">
                  {activeSession.isPaused ? 'Foco Pausado' : 'Foco Ativo'} • {activeTopic?.title || 'Estudando'}
                </p>
                <p className={cn(
                  "text-xl font-mono font-bold tabular-nums leading-none mt-1",
                  activeSession.isPaused ? "text-zinc-500" : "text-white"
                )}>
                  {formatTime(elapsed)}
                </p>
              </div>

              <div className="flex items-center gap-1 border-l border-zinc-800 pl-4">
                {showConfirm ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => endSession(true)}
                      className="w-10 h-10 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-500 flex items-center justify-center transition-colors"
                      title="Confirmar Finalização"
                    >
                      <Check className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 flex items-center justify-center transition-colors"
                      title="Cancelar"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => activeSession.isPaused ? resumeSession() : pauseSession()}
                      className="w-8 h-8 rounded-lg hover:bg-white/10 text-zinc-400 flex items-center justify-center transition-colors"
                      title={activeSession.isPaused ? "Retomar" : "Pausar"}
                    >
                      {activeSession.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="w-8 h-8 rounded-lg hover:bg-white/10 text-zinc-400 flex items-center justify-center transition-colors"
                      title="Minimizar"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="w-8 h-8 rounded-lg hover:bg-red-500/10 text-red-500 flex items-center justify-center transition-colors"
                      title="Finalizar Sessão"
                    >
                      <StopCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
