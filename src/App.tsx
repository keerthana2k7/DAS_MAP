import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LearningProvider } from './context/LearningContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Roadmap } from './pages/Roadmap';
import { CategoryPage } from './pages/CategoryPage';
import { Projects } from './pages/Projects';
import { StudyLog } from './pages/StudyLog';
import { Revision } from './pages/Revision';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <LearningProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/study-log" element={<StudyLog />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </LearningProvider>
  );
};

export default App;
