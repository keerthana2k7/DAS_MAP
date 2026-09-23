import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, Map, PlusCircle, Sparkles } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { ManualSessionModal } from '../study/ManualSessionModal';

export const DashboardQuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { continueLearningTopic, openTimer, openTopicModal } = useLearning();
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const handleContinueLearning = () => {
    if (continueLearningTopic) {
      openTopicModal(continueLearningTopic.topic.id);
    } else {
      navigate('/roadmap');
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={handleContinueLearning}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Continue Learning
        </button>

        <button
          onClick={() => openTimer()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
        >
          <Play className="w-3.5 h-3.5 text-violet-400 fill-current" />
          Start Study Session
        </button>

        <button
          onClick={() => navigate('/revision')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
          View Revision
        </button>

        <button
          onClick={() => navigate('/roadmap')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
        >
          <Map className="w-3.5 h-3.5 text-emerald-400" />
          View Roadmap
        </button>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
          Add Study Log
        </button>
      </div>

      <ManualSessionModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />
    </>
  );
};
