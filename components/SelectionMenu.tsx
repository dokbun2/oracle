import React from 'react';
import { ReadingType } from '../types';
import { Stars, Sparkles, ChevronLeft } from 'lucide-react';
import AdSense from './AdSense';

interface SelectionMenuProps {
  onSelect: (type: ReadingType) => void;
  onBack: () => void;
}

const SelectionMenu: React.FC<SelectionMenuProps> = ({ onSelect, onBack }) => {
  return (
    <div className="w-full max-w-5xl px-4 animate-fade-in flex flex-col items-center">
      <h2 className="text-3xl md:text-5xl font-display text-slate-100 mb-12 text-center drop-shadow-sm font-bold">
        당신의 <span className="text-orange-400">계시</span>를 선택하세요
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Horoscope Card */}
        <button
          onClick={() => onSelect(ReadingType.HOROSCOPE)}
          className="group relative flex flex-col items-center justify-center p-8 h-[320px] rounded-3xl bg-slate-900/80 border border-slate-700 hover:border-orange-500/70 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 shadow-lg overflow-hidden backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-slate-800 border border-orange-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-orange-500/10">
              <Stars size={40} className="text-orange-400 group-hover:text-orange-300" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-3 tracking-tight">천문 운세</h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-[80%] font-medium">
              NASA의 천체 데이터를 기반으로<br/>별들이 전하는 정밀한 운명
            </p>
          </div>
        </button>

        {/* Tarot Card */}
        <button
          onClick={() => onSelect(ReadingType.TAROT)}
          className="group relative flex flex-col items-center justify-center p-8 h-[320px] rounded-3xl bg-slate-900/80 border border-slate-700 hover:border-red-500/70 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2 shadow-lg overflow-hidden backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 flex flex-col items-center text-center">
             <div className="w-20 h-20 rounded-full bg-slate-800 border border-red-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-red-500/10">
              <Sparkles size={40} className="text-red-400 group-hover:text-red-300" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-3 tracking-tight">타로 리딩</h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-[80%] font-medium">
              무의식의 반영인 카드를 통해<br/>현재의 에너지와 조언을 탐색
            </p>
          </div>
        </button>
      </div>

      <button
        onClick={onBack}
        className="mt-8 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors py-3 px-6 rounded-full hover:bg-slate-800/50"
      >
        <ChevronLeft size={20} />
        <span className="text-lg font-medium">뒤로 가기</span>
      </button>

      {/* AdSense Ad - Bottom of Selection Menu */}
      <div className="w-full max-w-3xl mt-8">
        <AdSense
          className="rounded-xl overflow-hidden"
          style={{ minHeight: '100px' }}
        />
      </div>
    </div>
  );
};

export default SelectionMenu;