import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, Volume2, ArrowRight } from 'lucide-react';

export default function VoiceSearchModal({ isOpen, onClose, onQuerySubmit }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Listening for groceries...');
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  const voiceSuggestions = [
    'Amul Milk',
    'Fresh Paneer',
    'Aashirvaad Atta',
    'Lay\'s Magic Masala',
    'Amul Desi Ghee',
    'Maggi Noodles',
    'Coca Cola Can',
    'Farm Eggs'
  ];

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      setTranscript('');
      return;
    }

    // Request browser/native mic permission first, then start speech recognition
    const startAudioEngine = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop stream immediately as SpeechRecognition handles capture
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (micErr) {
        console.warn('Microphone permission query:', micErr);
      }

      // Check Web Speech API support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
        setStatusMessage('Speech recognition not supported in this browser. Tap any grocery suggestion below:');
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
          setStatusMessage('Listening... Speak grocery item now (e.g. "Amul Milk" or "Atta")');
        };

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);

          if (event.results[0].isFinal) {
            setStatusMessage(`Identified: "${currentTranscript}"`);
            setTimeout(() => {
              onQuerySubmit(currentTranscript);
              onClose();
            }, 700);
          }
        };

        recognition.onerror = (event) => {
          setIsListening(false);
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            setStatusMessage('Microphone permission needed. Tap mic button to allow or tap a suggestion below:');
          } else if (event.error === 'no-speech') {
            setStatusMessage('No speech detected. Tap mic to speak or tap a suggestion:');
          } else {
            setStatusMessage('Voice recognition ready. Tap mic or a suggestion below:');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        setIsListening(false);
        setStatusMessage('Tap mic to start or select a suggestion:');
      }
    };

    startAudioEngine();

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [isOpen]);

  const handleRestartListening = () => {
    if (recognitionRef.current) {
      try {
        setTranscript('');
        recognitionRef.current.start();
      } catch (e) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.start();
        } catch (err) {}
      }
    }
  };

  const handleSuggestionClick = (item) => {
    onQuerySubmit(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 relative shadow-2xl animate-in zoom-in duration-150 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 dark:hover:text-white bg-gray-100 dark:bg-slate-800 p-2 rounded-full transition"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles size={16} className="text-purple-600 animate-pulse" />
          <h3 className="font-black text-base text-gray-900 dark:text-white">Smart Voice Search</h3>
        </div>
        <p className="text-xs text-gray-500 font-medium mb-6">Say product name or brand to search instantly</p>

        {/* Pulsating Microphone Radar */}
        <div className="relative my-6 flex items-center justify-center">
          {isListening && (
            <>
              <div className="absolute w-28 h-28 rounded-full bg-purple-500/20 animate-ping" />
              <div className="absolute w-24 h-24 rounded-full bg-purple-500/30 animate-pulse" />
            </>
          )}

          <button
            onClick={handleRestartListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 relative z-10 ${
              isListening
                ? 'bg-gradient-to-tr from-purple-600 to-pink-600 scale-110 ring-4 ring-purple-200 dark:ring-purple-900'
                : 'bg-slate-800 hover:bg-purple-600 hover:scale-105'
            }`}
            title="Tap to speak"
          >
            {isListening ? <Mic size={32} className="animate-bounce" /> : <Mic size={32} />}
          </button>
        </div>

        {/* Live Transcript / Status */}
        <div className="min-h-[50px] flex flex-col items-center justify-center my-3">
          {transcript ? (
            <div className="bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-2xl px-4 py-2 text-xs font-black text-purple-700 dark:text-purple-300 animate-in fade-in duration-100">
              "{transcript}"
            </div>
          ) : (
            <p className="text-xs font-bold text-gray-600 dark:text-slate-300 leading-snug px-2">
              {statusMessage}
            </p>
          )}
        </div>

        {/* Quick Voice Suggestions */}
        <div className="pt-4 border-t border-gray-100 dark:border-slate-800 mt-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">
            Or Tap to Search Instantly
          </span>
          <div className="flex flex-wrap justify-center gap-1.5 max-h-36 overflow-y-auto">
            {voiceSuggestions.map((item) => (
              <button
                key={item}
                onClick={() => handleSuggestionClick(item)}
                className="bg-gray-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-700 text-gray-700 dark:text-slate-300 text-[11px] font-bold px-2.5 py-1 rounded-xl border border-gray-200 dark:border-slate-700 transition flex items-center gap-1 shadow-2xs"
              >
                <span>{item}</span>
                <ArrowRight size={10} className="opacity-50" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
