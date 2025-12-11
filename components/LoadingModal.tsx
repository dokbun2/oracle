import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingModalProps {
  isOpen: boolean;
  type: 'horoscope' | 'tarot';
  onMinTimeComplete?: () => void;
}

const HOROSCOPE_MESSAGES = [
  "사주팔자를 분석하고 있습니다...",
  "천간과 지지를 해석하고 있습니다...",
  "오행의 균형을 파악하고 있습니다...",
  "행성의 위치를 계산하고 있습니다...",
  "운세의 흐름을 읽고 있습니다...",
  "당신만의 운명을 정리하고 있습니다...",
];

const TAROT_MESSAGES = [
  "카드의 에너지를 감지하고 있습니다...",
  "우주의 메시지를 해석하고 있습니다...",
  "카드와 당신의 연결을 분석하고 있습니다...",
  "숨겨진 의미를 찾고 있습니다...",
  "운명의 실타래를 풀고 있습니다...",
  "당신을 위한 조언을 준비하고 있습니다...",
];

const MIN_LOADING_TIME = 15000; // 15초

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, type, onMinTimeComplete }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adLoadedRef = useRef(false);
  const minTimeCompleteRef = useRef(false);

  const messages = type === 'horoscope' ? HOROSCOPE_MESSAGES : TAROT_MESSAGES;
  const icon = type === 'horoscope' ? '🔮' : '🃏';
  const title = type === 'horoscope' ? '천체 운명 분석 중' : '타로 카드 해석 중';

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setMessageIndex(0);
      adLoadedRef.current = false;
      minTimeCompleteRef.current = false;
      return;
    }

    // 프로그레스 애니메이션
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 99) return 99;
        // 비선형 진행: 처음 빠르고 나중에 느려짐
        if (prev < 30) return prev + 6;
        if (prev < 60) return prev + 3;
        if (prev < 90) return prev + 2;
        return prev + 0.5;
      });
    }, 1000);

    // 메시지 로테이션 (3초 간격)
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 3000);

    // 최소 대기 시간 타이머
    const minTimeTimer = setTimeout(() => {
      minTimeCompleteRef.current = true;
      if (onMinTimeComplete) {
        onMinTimeComplete();
      }
    }, MIN_LOADING_TIME);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearTimeout(minTimeTimer);
    };
  }, [isOpen, messages.length, onMinTimeComplete]);

  // AdSense 광고 로드
  useEffect(() => {
    if (isOpen && adContainerRef.current && !adLoadedRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adLoadedRef.current = true;
      } catch (e) {
        console.error('AdSense load error:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg mx-4 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 shadow-2xl border border-slate-700">
        {/* 로딩 아이콘 */}
        <div className="flex flex-col items-center mb-8">
          <div className="text-6xl mb-4 animate-pulse">{icon}</div>
          <h2 className="text-2xl font-bold text-orange-400 mb-2 font-display tracking-wider">
            {title}
          </h2>
          <p className="text-slate-300 text-center min-h-[48px] flex items-center transition-opacity duration-500">
            {messages[messageIndex]}
          </p>
        </div>

        {/* 프로그레스 바 */}
        <div className="mb-6">
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-slate-400 text-sm">분석 진행 중...</span>
            <span className="text-orange-400 font-bold">{Math.floor(progress)}%</span>
          </div>
        </div>

        {/* 안내 메시지 */}
        <p className="text-center text-slate-500 text-sm mb-6">
          약 15~20초 소요됩니다. 잠시만 기다려주세요.
        </p>

        {/* AdSense 광고 영역 */}
        <div
          ref={adContainerRef}
          className="w-full bg-slate-800/50 rounded-xl p-2 min-h-[280px] flex items-center justify-center border border-slate-700"
        >
          <ins
            className="adsbygoogle"
            style={{
              display: 'block',
              width: '100%',
              height: '250px',
            }}
            data-ad-client="ca-pub-2764784359698938"
            data-ad-slot="7824924829"
            data-ad-format="rectangle"
            data-full-width-responsive="false"
          />
        </div>

        {/* 하단 장식 */}
        <div className="flex justify-center mt-6 gap-2">
          <Sparkles size={16} className="text-orange-400 animate-pulse" />
          <span className="text-slate-500 text-xs">Powered by Cosmic Oracle</span>
          <Sparkles size={16} className="text-orange-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
