import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Network, ScanFace, Cpu, Code, Zap } from 'lucide-react';

export function AILoadingState({ type = "plan" }: { type?: "plan" | "ad" | "video" }) {
  const [step, setStep] = useState(0);

  const steps = {
    plan: [
      { text: "Analyzing market data...", icon: <Network className="w-4 h-4 text-blue-500" /> },
      { text: "Identifying target audience...", icon: <ScanFace className="w-4 h-4 text-purple-500" /> },
      { text: "Drafting marketing strategies...", icon: <Cpu className="w-4 h-4 text-indigo-500" /> },
      { text: "Generating ad copies...", icon: <Code className="w-4 h-4 text-blue-500" /> },
      { text: "Finalizing marketing plan...", icon: <Zap className="w-4 h-4 text-purple-500" /> },
    ],
    ad: [
      { text: "Analyzing product context...", icon: <Network className="w-4 h-4 text-blue-500" /> },
      { text: "Identifying psychological hooks...", icon: <ScanFace className="w-4 h-4 text-purple-500" /> },
      { text: "Drafting ad variations...", icon: <Cpu className="w-4 h-4 text-indigo-500" /> },
      { text: "Refining calls to action...", icon: <Code className="w-4 h-4 text-blue-500" /> },
      { text: "Finalizing ad copies...", icon: <Zap className="w-4 h-4 text-purple-500" /> },
    ],
    video: [
      { text: "Analyzing video topic...", icon: <Network className="w-4 h-4 text-blue-500" /> },
      { text: "Generating viral hooks...", icon: <ScanFace className="w-4 h-4 text-purple-500" /> },
      { text: "Drafting scene descriptions...", icon: <Cpu className="w-4 h-4 text-indigo-500" /> },
      { text: "Writing engaging dialogue...", icon: <Code className="w-4 h-4 text-blue-500" /> },
      { text: "Finalizing video scripts...", icon: <Zap className="w-4 h-4 text-purple-500" /> },
    ]
  };

  const currentSteps = steps[type];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < currentSteps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, [currentSteps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm relative w-full mt-6">
      <div className="relative mb-10 flex items-center justify-center">
        <div className="absolute w-24 h-24 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-xl animate-pulse"></div>
        <div className="relative h-16 w-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-lg">
           <Sparkles className="h-8 w-8 text-blue-500 animate-pulse" />
        </div>
      </div>

      <div className="space-y-4 w-full max-w-sm px-6">
        {currentSteps.map((s, i) => {
          const isActive = i === step;
          const isPast = i < step;
          
          return (
            <div 
              key={i} 
              className={`flex items-center gap-4 transition-all duration-500 ease-out ${
                isActive ? 'opacity-100 translate-x-0' : 
                isPast ? 'opacity-50 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
            >
              <div className={`relative flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive ? 'bg-blue-50 border border-blue-200' : 
                isPast ? 'bg-slate-50 border border-slate-200' : 'bg-transparent'
              }`}>
                {isPast ? <CheckCircle2 className="w-4 h-4 text-slate-400" /> : s.icon}
              </div>
              <span className={`text-sm font-medium transition-colors duration-300 ${
                isActive ? 'text-slate-900' : 
                isPast ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {s.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
