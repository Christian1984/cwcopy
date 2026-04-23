import { useApp } from './state/AppContext';
import { NavBar } from './components/NavBar';
import { DrawPage } from './components/DrawPage';
import { ResultsPage } from './components/ResultsPage';
import { ResumeDialog } from './components/ResumeDialog';

export function App() {
  const { state } = useApp();

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${
      state.darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
    }`}>
      <NavBar />

      {/* flex-1 + overflow-hidden so DrawPage can own its own scroll/no-scroll */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {state.view === 'draw' ? <DrawPage /> : <ResultsPage />}
        {state.resumePrompt !== null && <ResumeDialog />}
      </main>
    </div>
  );
}
