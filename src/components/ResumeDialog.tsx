import { useApp } from '../state/AppContext';
import { clearStoredSession } from '../utils/storage';

export function ResumeDialog() {
  const { state, dispatch } = useApp();
  if (!state.resumePrompt) return null;

  const handleResume = () => {
    dispatch({ type: 'RESUME_SESSION', payload: state.resumePrompt! });
  };

  const handleStartOver = () => {
    clearStoredSession();
    dispatch({ type: 'DISMISS_RESUME_PROMPT' });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-dialog-title"
      className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div className={`mx-4 w-full max-w-sm rounded-2xl p-6 shadow-2xl ${
        state.darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
      }`}>
        <h2 id="resume-dialog-title" className="text-lg font-semibold mb-2">
          Resume session?
        </h2>
        <p className={`text-sm mb-6 ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          You have a previous session saved.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleResume}
            autoFocus
            className="w-full py-3 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Resume
          </button>
          <button
            onClick={handleStartOver}
            className={`w-full py-3 rounded-xl font-medium transition-colors ${
              state.darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
