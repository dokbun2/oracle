import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { ReadingResult, ReadingType, SajuNewYearData } from '../types';
import { Star, Sun, Heart, Coins, GraduationCap, RefreshCcw, Sparkles, Orbit, Moon, Quote, Download, Briefcase, HeartPulse, Calendar, Zap, AlertTriangle } from 'lucide-react';
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

  const handleSaveImage = async () => {
    if (isGeneratingPDF) return;

    setIsGeneratingPDF(true);

    try {
      let canvas: HTMLCanvasElement;
      let fileName: string;

      if (result.type === ReadingType.HOROSCOPE && result.horoscopeData) {
        // 운세: 모든 탭 내용을 하나의 이미지로
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
          width: 800px;
          padding: 60px;
          background: #0e172a;
          color: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        let allContentHtml = `
          <div style="text-align: center; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 2px solid #f97316;">
            <div style="display: inline-block; background: rgba(249, 115, 22, 0.2); border: 1px solid rgba(249, 115, 22, 0.3); color: #fb923c; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 16px;">
              ✨ CELESTIAL ANALYSIS
            </div>
            <h1 style="color: #f1f5f9; font-size: 42px; font-weight: bold; margin: 0;">
              천체 운명 분석
            </h1>
          </div>
        `;

        for (const tab of TABS) {
          const tabContent = result.horoscopeData[tab.key];
          if (!tabContent) continue;

          const contentHtml = tabContent
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fb923c;">$1</strong>')
            .replace(/^# (.*$)/gm, '<h1 style="color: #f1f5f9; font-size: 22px; margin: 24px 0 14px; border-left: 4px solid #f97316; padding-left: 12px;">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 style="color: #e2e8f0; font-size: 20px; margin: 20px 0 12px;">$1</h2>')
            .replace(/\n\n/g, '</p><p style="margin: 14px 0; line-height: 1.8; font-size: 16px;">')
            .replace(/\n/g, '<br>');

          allContentHtml += `
            <div style="margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid #334155;">
              <h2 style="color: #f97316; font-size: 26px; font-weight: bold; margin: 0 0 20px 0; padding-bottom: 12px; border-bottom: 3px solid #f97316; display: inline-block;">
                ${tabLabels[tab.key]}
              </h2>
              <div style="line-height: 1.8; font-size: 16px;">
                <p style="margin: 14px 0; line-height: 1.8;">${contentHtml}</p>
              </div>
            </div>
          `;
        }

        tempContainer.innerHTML = allContentHtml;
        document.body.appendChild(tempContainer);

        canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#0e172a',
          logging: false,
        });

        document.body.removeChild(tempContainer);
        fileName = `cosmic-oracle-horoscope-${new Date().toISOString().split('T')[0]}.png`;

      } else if (result.type === ReadingType.TAROT && contentRef.current) {
        // 타로: 화면 캡처
        canvas = await html2canvas(contentRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#0e172a',
          logging: false,
        });
        fileName = `cosmic-oracle-tarot-${result.tarotCard?.nameKr || 'reading'}-${new Date().toISOString().split('T')[0]}.png`;

      } else if (result.type === ReadingType.SAJU_NEWYEAR && result.sajuNewYearData) {
        // 신년운세
        const data = result.sajuNewYearData;

        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = `
          position: absolute;
          left: -9999px;
          top: 0;
          width: 800px;
          padding: 60px;
          background: #0e172a;
          color: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        tempContainer.innerHTML = `
          <div style="text-align: center; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 2px solid #eab308;">
            <div style="display: inline-block; background: rgba(234, 179, 8, 0.2); border: 1px solid rgba(234, 179, 8, 0.3); color: #fbbf24; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 16px;">
              ✨ SAJU FORTUNE
            </div>
            <h1 style="color: #f1f5f9; font-size: 42px; font-weight: bold; margin: 0;">
              ${data.yearInfo.year}년 신년 운세
            </h1>
          </div>

          <div style="display: flex; justify-content: center; gap: 24px; margin-bottom: 40px;">
            <div style="text-align: center; padding: 24px 32px; background: rgba(30, 41, 59, 0.7); border-radius: 16px; border: 1px solid rgba(234, 179, 8, 0.3);">
              <p style="color: #fbbf24; font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">당신의 일간</p>
              <p style="font-size: 48px; font-weight: bold; color: #f1f5f9; margin: 0 0 4px 0;">${data.userInfo.ilgan}</p>
              <p style="font-size: 28px; font-weight: bold; color: #fbbf24; margin: 0 0 8px 0;">${data.userInfo.ilganElement}</p>
              <p style="color: #94a3b8; font-size: 14px; margin: 0;">${data.userInfo.image}</p>
            </div>
            <div style="text-align: center; padding: 24px 32px; background: rgba(30, 41, 59, 0.7); border-radius: 16px; border: 1px solid rgba(234, 179, 8, 0.3);">
              <p style="color: #fbbf24; font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">${data.yearInfo.year}년 세운</p>
              <p style="font-size: 48px; font-weight: bold; color: #f1f5f9; margin: 0 0 8px 0;">${data.yearInfo.yearGanji}</p>
              <p style="color: #94a3b8; font-size: 14px; margin: 0;">${data.yearInfo.yearImage}</p>
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 40px;">
            <span style="display: inline-block; background: rgba(234, 179, 8, 0.2); border: 1px solid rgba(234, 179, 8, 0.3); color: #fbbf24; padding: 8px 20px; border-radius: 20px; font-size: 18px; font-weight: bold; margin-bottom: 16px;">
              ⚡ ${data.analysisResult.relationSibsin}
            </span>
            <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
              ${data.analysisResult.mainKeyword.map(kw => `<span style="background: rgba(51, 65, 85, 0.5); color: #cbd5e1; padding: 6px 14px; border-radius: 16px; font-size: 14px;">#${kw}</span>`).join('')}
            </div>
          </div>

          <div style="margin-bottom: 32px; padding: 24px; background: rgba(30, 41, 59, 0.5); border-radius: 16px; border-left: 4px solid #eab308;">
            <h2 style="color: #eab308; font-size: 22px; font-weight: bold; margin: 0 0 16px 0;">📅 총운</h2>
            <p style="color: #e2e8f0; font-size: 16px; line-height: 1.8; margin: 0;">${data.analysisResult.totalSummary}</p>
          </div>

          <div style="margin-bottom: 32px; padding: 24px; background: rgba(30, 41, 59, 0.5); border-radius: 16px; border-left: 4px solid #3b82f6;">
            <h2 style="color: #60a5fa; font-size: 22px; font-weight: bold; margin: 0 0 16px 0;">💼 직장/학업운</h2>
            <p style="color: #e2e8f0; font-size: 16px; line-height: 1.8; margin: 0;">${data.analysisResult.categories.career}</p>
          </div>

          <div style="margin-bottom: 32px; padding: 24px; background: rgba(30, 41, 59, 0.5); border-radius: 16px; border-left: 4px solid #22c55e;">
            <h2 style="color: #4ade80; font-size: 22px; font-weight: bold; margin: 0 0 16px 0;">💰 재물운</h2>
            <p style="color: #e2e8f0; font-size: 16px; line-height: 1.8; margin: 0;">${data.analysisResult.categories.wealth}</p>
          </div>

          <div style="margin-bottom: 32px; padding: 24px; background: rgba(30, 41, 59, 0.5); border-radius: 16px; border-left: 4px solid #ec4899;">
            <h2 style="color: #f472b6; font-size: 22px; font-weight: bold; margin: 0 0 16px 0;">💕 애정운</h2>
            <p style="color: #e2e8f0; font-size: 16px; line-height: 1.8; margin: 0;">${data.analysisResult.categories.love}</p>
          </div>

          <div style="margin-bottom: 32px; padding: 24px; background: rgba(30, 41, 59, 0.5); border-radius: 16px; border-left: 4px solid ${data.analysisResult.categories.health.status === 'Warning' ? '#ef4444' : '#10b981'};">
            <h2 style="color: ${data.analysisResult.categories.health.status === 'Warning' ? '#f87171' : '#34d399'}; font-size: 22px; font-weight: bold; margin: 0 0 16px 0;">
              ${data.analysisResult.categories.health.status === 'Warning' ? '⚠️' : '💪'} 건강운
              ${data.analysisResult.categories.health.status === 'Warning' ? '<span style="background: rgba(239, 68, 68, 0.2); color: #f87171; padding: 4px 10px; border-radius: 12px; font-size: 12px; margin-left: 8px;">주의</span>' : ''}
            </h2>
            ${data.analysisResult.categories.health.vulnerableOrgans.length > 0 ? `
              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                ${data.analysisResult.categories.health.vulnerableOrgans.map(organ => `<span style="background: rgba(239, 68, 68, 0.1); color: #fca5a5; padding: 4px 12px; border-radius: 8px; font-size: 14px;">${organ}</span>`).join('')}
              </div>
            ` : ''}
            <p style="color: #e2e8f0; font-size: 16px; line-height: 1.8; margin: 0;">${data.analysisResult.categories.health.advice}</p>
          </div>

          <div style="padding: 24px; background: linear-gradient(to right, rgba(113, 63, 18, 0.3), rgba(30, 41, 59, 0.5)); border-radius: 16px; border: 1px solid rgba(234, 179, 8, 0.3);">
            <h2 style="color: #fbbf24; font-size: 22px; font-weight: bold; margin: 0 0 16px 0;">✨ 올해의 실천 조언</h2>
            <p style="color: #f1f5f9; font-size: 18px; line-height: 1.8; margin: 0; font-weight: 500;">${data.analysisResult.actionItem}</p>
          </div>
        `;

        document.body.appendChild(tempContainer);

        canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#0e172a',
          logging: false,
        });

        document.body.removeChild(tempContainer);
        fileName = `cosmic-oracle-saju-${data.yearInfo.year}-${new Date().toISOString().split('T')[0]}.png`;

      } else {
        throw new Error('저장할 데이터가 없습니다.');
      }

      // 이미지 다운로드
      const imgData = canvas.toDataURL('image/png');

      // 모바일/데스크탑 모두 호환
      const link = document.createElement('a');
      link.href = imgData;
      link.download = fileName;

      // iOS Safari 대응
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // iOS에서는 새 탭에서 이미지 열기 (길게 눌러서 저장)
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`
            <html>
              <head><title>${fileName}</title></head>
              <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#000;">
                <img src="${imgData}" style="max-width:100%; height:auto;" />
              </body>
            </html>
          `);
          newTab.document.close();
        }
      } else {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

    } catch (error) {
      console.error('이미지 저장 오류:', error);
      alert('이미지 저장 중 오류가 발생했습니다.');
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
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-3 ${
          result.type === ReadingType.SAJU_NEWYEAR
            ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
            : 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
        }`}>
          <Sparkles size={14} />
          {result.type === ReadingType.HOROSCOPE ? 'CELESTIAL ANALYSIS' :
           result.type === ReadingType.SAJU_NEWYEAR ? 'SAJU FORTUNE' : 'TAROT READING'}
        </div>
        <h2 className="text-3xl md:text-5xl font-display text-slate-100 font-bold">
          {result.type === ReadingType.HOROSCOPE ? '천체 운명 분석' :
           result.type === ReadingType.SAJU_NEWYEAR ? `${result.sajuNewYearData?.yearInfo.year}년 신년 운세` : '타로 리딩 결과'}
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

        {/* Saju New Year Fortune View */}
        {result.type === ReadingType.SAJU_NEWYEAR && result.sajuNewYearData && (
          <div className="flex flex-col w-full">
            {/* 상단 요약 영역 */}
            <div className="p-8 bg-gradient-to-r from-yellow-900/30 to-slate-900/50 border-b border-slate-700">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* 사주 정보 카드 */}
                <div className="flex gap-4">
                  {/* 일간 */}
                  <div className="text-center p-6 bg-slate-800/70 rounded-2xl border border-yellow-500/30">
                    <p className="text-yellow-400 text-sm font-bold mb-2">당신의 일간</p>
                    <p className="text-5xl font-bold text-slate-100 mb-1">{result.sajuNewYearData.userInfo.ilgan}</p>
                    <p className="text-2xl font-bold text-yellow-400 mb-2">{result.sajuNewYearData.userInfo.ilganElement}</p>
                    <p className="text-slate-500 text-xs">{result.sajuNewYearData.userInfo.image}</p>
                  </div>
                  {/* 세운 */}
                  <div className="text-center p-6 bg-slate-800/70 rounded-2xl border border-yellow-500/30">
                    <p className="text-yellow-400 text-sm font-bold mb-2">{result.sajuNewYearData.yearInfo.year}년 세운</p>
                    <p className="text-5xl font-bold text-slate-100 mb-2">{result.sajuNewYearData.yearInfo.yearGanji}</p>
                    <p className="text-slate-400 text-sm">{result.sajuNewYearData.yearInfo.yearGan} + {result.sajuNewYearData.yearInfo.yearJi}</p>
                    <p className="text-slate-500 text-xs mt-1">{result.sajuNewYearData.yearInfo.yearImage}</p>
                  </div>
                </div>

                {/* 십성 관계 */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full border border-yellow-500/30 mb-4">
                    <Zap size={18} className="text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-lg">{result.sajuNewYearData.analysisResult.relationSibsin}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {result.sajuNewYearData.analysisResult.mainKeyword.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm font-medium">
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 총운 요약 */}
            <div className="p-8 bg-slate-800/30 border-b border-slate-700">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Calendar size={24} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-3">총운</h3>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {result.sajuNewYearData.analysisResult.totalSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* 카테고리별 운세 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* 직장/학업운 */}
              <div className="p-8 border-b md:border-r border-slate-700">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Briefcase size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3">직장/학업운</h3>
                    <p className="text-slate-300 leading-relaxed">
                      {result.sajuNewYearData.analysisResult.categories.career}
                    </p>
                  </div>
                </div>
              </div>

              {/* 재물운 */}
              <div className="p-8 border-b border-slate-700">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Coins size={24} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3">재물운</h3>
                    <p className="text-slate-300 leading-relaxed">
                      {result.sajuNewYearData.analysisResult.categories.wealth}
                    </p>
                  </div>
                </div>
              </div>

              {/* 애정운 */}
              <div className="p-8 border-b md:border-b-0 md:border-r border-slate-700">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-500/20 rounded-xl">
                    <Heart size={24} className="text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3">애정운</h3>
                    <p className="text-slate-300 leading-relaxed">
                      {result.sajuNewYearData.analysisResult.categories.love}
                    </p>
                  </div>
                </div>
              </div>

              {/* 건강운 */}
              <div className="p-8">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    result.sajuNewYearData.analysisResult.categories.health.status === 'Warning'
                      ? 'bg-red-500/20'
                      : 'bg-emerald-500/20'
                  }`}>
                    {result.sajuNewYearData.analysisResult.categories.health.status === 'Warning' ? (
                      <AlertTriangle size={24} className="text-red-400" />
                    ) : (
                      <HeartPulse size={24} className="text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3 flex items-center gap-2">
                      건강운
                      {result.sajuNewYearData.analysisResult.categories.health.status === 'Warning' && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">주의</span>
                      )}
                    </h3>
                    {result.sajuNewYearData.analysisResult.categories.health.vulnerableOrgans.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {result.sajuNewYearData.analysisResult.categories.health.vulnerableOrgans.map((organ, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-500/10 text-red-300 rounded text-sm">
                            {organ}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-slate-300 leading-relaxed">
                      {result.sajuNewYearData.analysisResult.categories.health.advice}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 실천 조언 */}
            <div className="p-8 bg-gradient-to-r from-yellow-900/20 to-slate-900/50 border-t border-slate-700">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Sparkles size={24} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">올해의 실천 조언</h3>
                  <p className="text-slate-200 text-lg leading-relaxed font-medium">
                    {result.sajuNewYearData.analysisResult.actionItem}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {result.type === ReadingType.SAJU_NEWYEAR && !result.sajuNewYearData && (
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
          onClick={handleSaveImage}
          disabled={isGeneratingPDF}
          className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-full transition-all duration-300 text-xl font-bold shadow-xl shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={22} />
          <span>{isGeneratingPDF ? '이미지 생성 중...' : '이미지 저장'}</span>
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