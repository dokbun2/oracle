import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReadingResult, ReadingType } from '../types';
import { Star, Sun, Heart, Coins, GraduationCap, RefreshCcw, Sparkles, Orbit, Moon, Quote, Download } from 'lucide-react';
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const handleSavePDF = async () => {
    if (isGeneratingPDF) return;

    setIsGeneratingPDF(true);

    try {
      // 공통 PDF 생성 함수
      const createPDF = async (canvas: HTMLCanvasElement, fileName: string) => {
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;

        const pdfWidth = 210;
        const pdfHeight = pdfWidth / ratio;
        const margin = 5;

        const pdf = new jsPDF({
          orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
          unit: 'mm',
          format: [pdfWidth, pdfHeight + (margin * 2)],
        });

        pdf.setFillColor(14, 23, 42); // #0e172a
        pdf.rect(0, 0, pdfWidth, pdfHeight + (margin * 2), 'F');

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth - (margin * 2), pdfHeight);

        pdf.save(fileName);
      };

      // 공통 제목 HTML
      const createTitleHtml = (title: string, subtitle: string) => `
        <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #f97316;">
          <div style="display: inline-block; background: rgba(249, 115, 22, 0.2); border: 1px solid rgba(249, 115, 22, 0.3); color: #fb923c; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 12px;">
            ✨ ${subtitle}
          </div>
          <h1 style="color: #f1f5f9; font-size: 32px; font-weight: bold; margin: 0;">
            ${title}
          </h1>
        </div>
      `;

      if (result.type === ReadingType.HOROSCOPE && result.horoscopeData) {
        // 운세: 모든 탭 내용을 하나의 긴 이미지로 만들어서 한 페이지에 저장
        const tabLabels: { [key in TabKey]: string } = {
          general: '종합 운세',
          newYear: '신년 운세',
          love: '애정 운세',
          business: '재물 운세',
          career: '직장 운세',
        };

        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = `
          position: absolute;
          left: -9999px;
          top: 0;
          width: 1200px;
          padding: 40px;
          background: #0e172a;
          color: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        let allContentHtml = createTitleHtml('천체 운명 분석', 'CELESTIAL ANALYSIS');

        for (const tab of TABS) {
          const tabContent = result.horoscopeData[tab.key];
          if (!tabContent) continue;

          const contentHtml = tabContent
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fb923c;">$1</strong>')
            .replace(/^# (.*$)/gm, '<h1 style="color: #f1f5f9; font-size: 18px; margin: 16px 0 10px; border-left: 3px solid #f97316; padding-left: 8px;">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 style="color: #e2e8f0; font-size: 16px; margin: 12px 0 8px;">$1</h2>')
            .replace(/\n\n/g, '</p><p style="margin: 8px 0; line-height: 1.5; font-size: 12px;">')
            .replace(/\n/g, '<br>');

          allContentHtml += `
            <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #334155;">
              <h2 style="color: #f97316; font-size: 20px; font-weight: bold; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #f97316; display: inline-block;">
                ${tabLabels[tab.key]}
              </h2>
              <div style="line-height: 1.5; font-size: 12px;">
                <p style="margin: 8px 0; line-height: 1.5;">${contentHtml}</p>
              </div>
            </div>
          `;
        }

        tempContainer.innerHTML = allContentHtml;
        document.body.appendChild(tempContainer);

        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#0e172a',
          logging: false,
        });

        document.body.removeChild(tempContainer);

        const fileName = `cosmic-oracle-horoscope-${new Date().toISOString().split('T')[0]}.pdf`;
        await createPDF(canvas, fileName);

      } else if (result.type === ReadingType.TAROT && result.tarotCard) {
        // 타로: 카드 정보와 해석을 하나의 컨테이너에 담기
        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = `
          position: absolute;
          left: -9999px;
          top: 0;
          width: 1200px;
          padding: 40px;
          background: #0e172a;
          color: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        // 타로 해석 내용 변환
        const tarotContentHtml = (result.text || '')
          .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fb923c;">$1</strong>')
          .replace(/^# (.*$)/gm, '<h1 style="color: #f1f5f9; font-size: 20px; margin: 20px 0 12px; border-left: 3px solid #f97316; padding-left: 10px;">$1</h1>')
          .replace(/^## (.*$)/gm, '<h2 style="color: #e2e8f0; font-size: 18px; margin: 16px 0 10px;">$1</h2>')
          .replace(/^### (.*$)/gm, '<h3 style="color: #cbd5e1; font-size: 16px; margin: 14px 0 8px;">$1</h3>')
          .replace(/\n\n/g, '</p><p style="margin: 10px 0; line-height: 1.6; font-size: 13px;">')
          .replace(/\n/g, '<br>');

        tempContainer.innerHTML = `
          ${createTitleHtml('타로 리딩 결과', 'TAROT READING')}

          <div style="display: flex; gap: 40px; align-items: flex-start;">
            <!-- 카드 정보 -->
            <div style="flex-shrink: 0; width: 280px; text-align: center;">
              <div style="width: 280px; height: 420px; border-radius: 16px; overflow: hidden; border: 3px solid rgba(249, 115, 22, 0.3); margin-bottom: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                <img src="${result.tarotCard.imageUrl}" alt="${result.tarotCard.name}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
              </div>
              <h3 style="color: #f1f5f9; font-size: 24px; font-weight: bold; margin: 0 0 8px 0;">${result.tarotCard.name}</h3>
              <p style="color: #fb923c; font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">${result.tarotCard.nameKr}</p>
              <div style="background: rgba(30, 41, 59, 0.7); padding: 16px; border-radius: 12px; border: 1px solid #475569;">
                <p style="color: #cbd5e1; font-style: italic; font-size: 14px; line-height: 1.6; margin: 0;">"${result.tarotCard.meaning}"</p>
              </div>
            </div>

            <!-- 해석 내용 -->
            <div style="flex: 1; line-height: 1.6; font-size: 13px;">
              <p style="margin: 10px 0; line-height: 1.6;">${tarotContentHtml}</p>
            </div>
          </div>
        `;

        document.body.appendChild(tempContainer);

        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#0e172a',
          logging: false,
        });

        document.body.removeChild(tempContainer);

        const fileName = `cosmic-oracle-tarot-${result.tarotCard.nameKr}-${new Date().toISOString().split('T')[0]}.pdf`;
        await createPDF(canvas, fileName);
      }

    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 저장 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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

      <div ref={contentRef} className="bg-slate-900/90 border border-slate-700 rounded-3xl shadow-2xl shadow-orange-500/5 overflow-hidden flex flex-col backdrop-blur-sm">
        
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

      <div className="mt-6 flex justify-center gap-4 flex-wrap">
        <button
          onClick={handleSavePDF}
          disabled={isGeneratingPDF}
          className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-full transition-all duration-300 text-xl font-bold shadow-xl shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={22} />
          <span>{isGeneratingPDF ? 'PDF 생성 중...' : 'PDF 저장'}</span>
        </button>
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