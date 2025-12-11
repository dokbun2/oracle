import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ReadingResult, ReadingType } from '../types';
import { Star, Sun, Heart, Coins, GraduationCap, RefreshCcw, Sparkles, Orbit, Moon, Quote } from 'lucide-react';
import AdSense from './AdSense';

interface ResultDisplayProps {
  result: ReadingResult;
  onReset: () => void;
}

type TabKey = 'general' | 'newYear' | 'love' | 'business' | 'career';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'general', label: '종합', icon: <Star size={18} /> },
  { key: 'newYear', label: '신년', icon: <Sun size={18} /> },
  { key: 'love', label: '애정', icon: <Heart size={18} /> },
  { key: 'business', label: '재물', icon: <Coins size={18} /> },
  { key: 'career', label: '직장', icon: <GraduationCap size={18} /> },
];

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('general');

  // Helper to improved readability by adding line breaks after sentences
  // Avoids breaking list numbering (e.g. "1. ")
  const formatTextForReadability = (text: string | undefined) => {
    if (!text) return '';
    // Replace period/question/exclamation followed by space with double newline
    // Only if the character preceding the punctuation is NOT a digit (to protect list numbers)
    return text.replace(/([^0-9])([.!?])\s+/g, '$1$2\n\n');
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in flex flex-col h-full md:h-auto pb-20 md:pb-0">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-bold mb-3">
          <Sparkles size={14} />
          {result.type === ReadingType.HOROSCOPE ? 'CELESTIAL ANALYSIS' : 'TAROT READING'}
        </div>
        <h2 className="text-3xl md:text-5xl font-display text-slate-100 font-bold">
          {result.type === ReadingType.HOROSCOPE ? '천체 운명 분석' : '타로 리딩 결과'}
        </h2>
      </div>

      <div className="bg-slate-900/90 border border-slate-700 rounded-3xl shadow-2xl shadow-orange-500/5 overflow-hidden flex flex-col backdrop-blur-sm">
        
        {/* Tarot Card View */}
        {result.type === ReadingType.TAROT && result.tarotCard && (
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Left Column: Visuals & Core Meaning (Sticky on Desktop) */}
            <div className="w-full lg:w-4/12 p-8 lg:p-12 bg-slate-800/50 border-b lg:border-b-0 lg:border-r border-slate-700 flex flex-col items-center text-center">
               <div className="relative w-64 lg:w-full max-w-[320px] aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border-[4px] border-orange-500/30 mb-8 transform transition-transform hover:scale-[1.02] duration-500 ring-1 ring-orange-500/10">
                  <img
                      src={result.tarotCard.imageUrl}
                      alt={result.tarotCard.name}
                      className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                      <p className="text-orange-300 font-display tracking-widest text-sm opacity-90 font-bold drop-shadow-md">ARCANA</p>
                  </div>
              </div>

              <h3 className="text-3xl font-display text-slate-100 mb-2 font-bold">{result.tarotCard.name}</h3>
              <p className="text-orange-400 font-serif text-2xl mb-8 font-semibold">{result.tarotCard.nameKr}</p>

              <div className="bg-slate-800/70 p-6 rounded-xl border border-slate-600 w-full relative group shadow-lg">
                  <Quote size={24} className="absolute top-4 left-4 text-slate-500 group-hover:text-orange-400 transition-colors" />
                  <p className="text-slate-300 font-serif italic text-xl leading-relaxed pt-4 px-2">
                    "{result.tarotCard.meaning}"
                  </p>
              </div>
            </div>
            
            {/* Right Column: Detailed Interpretation */}
            <div className="w-full lg:w-8/12 p-8 lg:p-14 overflow-y-auto bg-slate-900/50">
               <div className="prose prose-lg prose-invert max-w-none text-slate-300 leading-loose animate-fade-in">
                  <ReactMarkdown components={{
                      strong: ({node, ...props}) => <span className="text-orange-400 font-bold border-b-2 border-orange-500/30 pb-0.5" {...props} />,
                      h1: ({node, ...props}) => <h3 className="text-3xl font-bold text-slate-100 mb-8 mt-10 flex items-center gap-3 pb-4 border-b-2 border-slate-700" {...props} />,
                      h2: ({node, ...props}) => <h4 className="text-2xl font-bold text-red-400 mb-5 mt-10" {...props} />,
                      h3: ({node, ...props}) => <h5 className="text-xl font-bold text-slate-200 mb-4 mt-8" {...props} />,
                      p: ({node, ...props}) => <p className="mb-6 text-slate-300 leading-loose tracking-wide font-normal text-lg md:text-xl" {...props} />,
                      ul: ({node, ...props}) => <ul className="space-y-4 mb-10 bg-slate-800/50 p-8 rounded-2xl border border-slate-700" {...props} />,
                      li: ({node, ...props}) => <li className="text-slate-300 pl-2 marker:text-orange-400 text-lg md:text-xl leading-relaxed" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-orange-500 pl-6 italic text-xl md:text-2xl text-slate-300 my-10 py-4 bg-orange-500/10 rounded-r-xl not-italic" {...props} />
                  }}>
                      {formatTextForReadability(result.text)}
                  </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Horoscope View */}
        {result.type === ReadingType.HOROSCOPE && result.horoscopeData && (
          <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row h-full min-h-[500px]">
                {/* Tabs Sidebar (Desktop) / Topbar (Mobile) */}
                <div className="md:w-64 bg-slate-800/50 border-b md:border-b-0 md:border-r border-slate-700">
                    <div className="flex md:flex-col overflow-x-auto scrollbar-hide p-4 gap-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 w-full
                                    ${activeTab === tab.key
                                        ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/30 translate-y-[-1px]'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}
                                `}
                            >
                                {tab.icon}
                                <span className="text-lg">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-grow p-6 md:p-12 overflow-y-auto bg-slate-900/50">
                    <div className="prose prose-lg prose-invert max-w-none text-slate-300 leading-loose animate-fade-in">
                        <ReactMarkdown components={{
                        strong: ({node, ...props}) => <strong className="text-orange-400 font-bold" {...props} />,
                        h1: ({node, ...props}) => <h3 className="text-3xl font-bold text-slate-100 mb-6 mt-8 border-l-4 border-orange-500 pl-4" {...props} />,
                        h2: ({node, ...props}) => <h4 className="text-2xl font-bold text-slate-200 mb-4 mt-6" {...props} />,
                        p: ({node, ...props}) => <p className="mb-6 text-slate-300 font-normal text-lg md:text-xl leading-loose" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-8 space-y-3 text-slate-300 text-lg md:text-xl" {...props} />,
                        }}>
                            {formatTextForReadability(result.horoscopeData[activeTab])}
                        </ReactMarkdown>
                    </div>

                    {/* Simple Text-based Planetary Alignment Section (Moved to bottom) */}
                     {result.horoscopeData.planetaryPositions && result.horoscopeData.planetaryPositions.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-slate-700">
                            <h4 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-widest">
                                <Orbit size={16} />
                                Planetary Alignment Summary
                            </h4>
                            <div className="flex flex-wrap gap-x-6 gap-y-3 text-base">
                                {result.horoscopeData.planetaryPositions.map((planet, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-slate-400 bg-slate-800/70 px-3 py-1 rounded-lg border border-slate-700">
                                        <span className="font-bold text-slate-200">{planet.name}</span>
                                        <span className="text-slate-600">|</span>
                                        <span className="text-orange-400 font-medium">{planet.signKr}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}

        {result.type === ReadingType.HOROSCOPE && !result.horoscopeData && (
          <div className="w-full h-64 flex items-center justify-center text-red-400 text-lg font-bold">
              데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        )}
      </div>

      {/* AdSense Ad - Between Content and Button */}
      <div className="w-full max-w-3xl mx-auto mt-8">
        <AdSense
          className="rounded-xl overflow-hidden"
          style={{ minHeight: '100px' }}
        />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-10 py-4 bg-slate-800 border border-slate-700 hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-500 hover:border-orange-500 text-white rounded-full transition-all duration-300 text-xl font-bold shadow-xl hover:shadow-orange-500/30"
        >
          <RefreshCcw size={22} />
          <span>다시 하기</span>
        </button>
      </div>

      {/* AdSense Ad - Bottom of Result Page */}
      <div className="w-full max-w-3xl mx-auto mt-8">
        <AdSense
          className="rounded-xl overflow-hidden"
          style={{ minHeight: '250px' }}
        />
      </div>
    </div>
  );
};

export default ResultDisplay;