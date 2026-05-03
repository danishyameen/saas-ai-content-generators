import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
      // Show banner after a short delay if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = (e) => {
    e.preventDefault();
    if (!promptInstall) return;
    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        setShowBanner(false);
      }
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:max-w-sm">
      <div className="bg-primary-600 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4 border border-primary-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
            <Download size={20} />
          </div>
          <div>
            <p className="font-bold text-sm">Install GeniFai App</p>
            <p className="text-xs text-primary-100">Access GeniFai directly from your home screen</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClick}
            className="bg-white text-primary-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary-50 transition-colors"
          >
            Install
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
