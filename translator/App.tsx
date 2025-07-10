import React, { useState, useCallback } from 'react';
import { translateToJapanese } from './services/geminiService';
import { CopyIcon, ClearIcon, LanguageArrowIcon, SpinnerIcon } from './components/icons';

// A small component to show a "Copied!" notification
const CopyNotification = ({ visible }: { visible: boolean }) => (
  <div className={`absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md transition-opacity duration-300 pointer-events-none ${visible ? 'opacity-100' : 'opacity-0'}`}>
    Copied!
  </div>
);

// Main App Component
const App: React.FC = () => {
  // State management
  const [inputText, setInputText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCopyNotification, setShowCopyNotification] = useState<boolean>(false);
  
  // Handlers
  const handleTranslate = useCallback(async () => {
    if (!inputText || isLoading) return;

    setIsLoading(true);
    setError(null);
    setTranslatedText(''); // Clear previous translation

    try {
      const result = await translateToJapanese(inputText);
      setTranslatedText(result);
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading]);

  const handleCopy = useCallback(() => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 2000);
  }, [translatedText]);

  const handleClear = useCallback(() => {
    setInputText('');
    setTranslatedText('');
    setError(null);
  }, []);

  return (
    <div className="bg-slate-900 text-gray-200 min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-6">
      <main className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            AI Translator
          </h1>
          <p className="text-slate-400 mt-2">English to Japanese, powered by Gemini</p>
        </header>

        {/* Translation Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-center">
          {/* English Panel */}
          <div className="bg-slate-800/50 ring-1 ring-white/10 rounded-xl shadow-lg flex flex-col h-72 sm:h-80 relative">
            <div className="flex justify-between items-center p-3 border-b border-slate-700">
              <h2 className="font-semibold text-slate-300">English</h2>
              <button
                onClick={handleClear}
                disabled={!inputText}
                className="text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed transition-colors p-1 rounded-md hover:bg-slate-700"
                title="Clear text"
              >
                <ClearIcon />
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              className="bg-transparent w-full flex-grow p-4 resize-none focus:outline-none text-lg text-gray-200 placeholder-slate-500"
            />
          </div>

          {/* Arrow Icon (visible on large screens) */}
          <div className="hidden lg:flex justify-center items-center">
             <LanguageArrowIcon className="w-10 h-10 text-slate-600" />
          </div>

          {/* Japanese Panel */}
          <div className="bg-slate-800/50 ring-1 ring-white/10 rounded-xl shadow-lg flex flex-col h-72 sm:h-80 relative">
            <div className="flex justify-between items-center p-3 border-b border-slate-700">
              <h2 className="font-semibold text-slate-300">Japanese</h2>
              <button
                onClick={handleCopy}
                disabled={!translatedText}
                className="text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed transition-colors p-1 rounded-md hover:bg-slate-700"
                title="Copy translation"
              >
                <CopyIcon />
              </button>
            </div>
            <div className="relative w-full flex-grow p-4">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 bg-opacity-50 rounded-b-xl">
                   <div className="flex flex-col items-center gap-2">
                     <SpinnerIcon className="w-8 h-8 text-indigo-400" />
                     <p className="text-slate-400">Translating...</p>
                   </div>
                </div>
              )}
               <pre className="bg-transparent w-full h-full whitespace-pre-wrap text-lg text-gray-200 font-sans">
                {translatedText}
              </pre>
              <CopyNotification visible={showCopyNotification} />
            </div>
          </div>
        </div>
        
        {/* Translate Button and Error Message */}
        <div className="mt-8 text-center">
           <button
             onClick={handleTranslate}
             disabled={isLoading || !inputText}
             className="bg-indigo-600 text-white font-bold py-3 px-10 rounded-full hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 ease-in-out disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
           >
             {isLoading ? (
               <>
                 <SpinnerIcon className="mr-3" />
                 <span>Translating...</span>
               </>
             ) : (
               <span>Translate</span>
             )}
           </button>
          {error && <p className="text-red-400 mt-4 font-medium">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default App;
