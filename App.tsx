import React, { useState, useRef } from 'react';
import { UserData, AppMode, ReadingType, ReadingResult, TarotCard } from './types';
import { INITIAL_USER_DATA } from './constants';
import { generateHoroscope, generateTarotReading } from './services/geminiService';
import { generateSajuNewYear } from './services/sajuService';
import { checkUsageLimit, incrementUsage, getRemainingUsage } from './utils/usageLimit';
import StarBackground from './components/StarBackground';
import InputForm from './components/InputForm';
import SelectionMenu from './components/SelectionMenu';
import TarotDeck from './components/TarotDeck';
import ResultDisplay from './components/ResultDisplay';
import LoadingModal from './components/LoadingModal';

const MIN_LOADING_TIME = 15000; // 15초 최소 대기 시간

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.INPUT);
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [loadingType, setLoadingType] = useState<'horoscope' | 'tarot' | 'saju'>('horoscope');

  // API 결과와 최소 대기 시간 관리를 위한 ref
  const apiResultRef = useRef<any>(null);
  const apiCompleteRef = useRef(false);
  const minTimeCompleteRef = useRef(false);
  const currentTypeRef = useRef<ReadingType>(ReadingType.HOROSCOPE);
  const selectedCardRef = useRef<TarotCard | null>(null);

  // 결과 표시 조건 체크 및 처리
  const checkAndShowResult = () => {
    if (apiCompleteRef.current && minTimeCompleteRef.current) {
      const type = currentTypeRef.current;

      if (type === ReadingType.HOROSCOPE) {
        if (apiResultRef.current) {
          incrementUsage(userData);
          setResult({ type, horoscopeData: apiResultRef.current });
        } else {
          setResult({ type, horoscopeData: undefined, text: "운세 데이터를 불러오지 못했습니다." });
        }
      } else if (type === ReadingType.SAJU_NEWYEAR) {
        if (apiResultRef.current) {
          incrementUsage(userData);
          setResult({ type, sajuNewYearData: apiResultRef.current });
        } else {
          setResult({ type, sajuNewYearData: undefined, text: "신년운세 데이터를 불러오지 못했습니다." });
        }
      } else {
        const text = apiResultRef.current;
        if (text && !text.includes("오류")) {
          incrementUsage(userData);
        }
        setResult({ type: ReadingType.TAROT, text, tarotCard: selectedCardRef.current! });
      }

      setMode(AppMode.RESULT);
    }
  };

  // 최소 대기 시간 완료 핸들러
  const handleMinTimeComplete = () => {
    minTimeCompleteRef.current = true;
    checkAndShowResult();
  };

  const handleFormSubmit = () => {
    // 입력 단계에서 미리 횟수를 체크하여 사용자에게 알려줄 수도 있지만,
    // 구체적인 '실행' 버튼(카드 선택 등)을 누를 때 체크하는 것이 더 자연스럽습니다.
    setMode(AppMode.SELECTION);
  };

  const handleSelection = async (type: ReadingType) => {
    if (type === ReadingType.HOROSCOPE) {
      if (!checkUsageLimit(userData)) {
        alert("해당 생년월일로 무료 체험 횟수(3회)를 모두 소진하셨습니다.");
        return;
      }

      // 상태 초기화
      apiResultRef.current = null;
      apiCompleteRef.current = false;
      minTimeCompleteRef.current = false;
      currentTypeRef.current = ReadingType.HOROSCOPE;
      setLoadingType('horoscope');
      setMode(AppMode.LOADING);

      // API 호출 (비동기로 진행)
      generateHoroscope(userData)
        .then((data) => {
          apiResultRef.current = data;
          apiCompleteRef.current = true;
          checkAndShowResult();
        })
        .catch((error) => {
          console.error('Horoscope API Error:', error);
          apiResultRef.current = null;
          apiCompleteRef.current = true;
          checkAndShowResult();
        });
    } else if (type === ReadingType.SAJU_NEWYEAR) {
      if (!checkUsageLimit(userData)) {
        alert("해당 생년월일로 무료 체험 횟수(3회)를 모두 소진하셨습니다.");
        return;
      }

      // 상태 초기화
      apiResultRef.current = null;
      apiCompleteRef.current = false;
      minTimeCompleteRef.current = false;
      currentTypeRef.current = ReadingType.SAJU_NEWYEAR;
      setLoadingType('saju');
      setMode(AppMode.LOADING);

      // API 호출 (비동기로 진행)
      generateSajuNewYear(userData)
        .then((data) => {
          apiResultRef.current = data;
          apiCompleteRef.current = true;
          checkAndShowResult();
        })
        .catch((error) => {
          console.error('Saju API Error:', error);
          apiResultRef.current = null;
          apiCompleteRef.current = true;
          checkAndShowResult();
        });
    } else {
      // 타로는 덱 화면으로 이동 후 카드 선택 시 체크
      setMode(AppMode.TAROT_DECK);
    }
  };

  const handleTarotCardSelected = async (card: TarotCard) => {
    if (!checkUsageLimit(userData)) {
      alert("해당 생년월일로 무료 체험 횟수(3회)를 모두 소진하셨습니다.");
      setMode(AppMode.SELECTION); // 다시 선택 화면으로
      return;
    }

    // 상태 초기화
    apiResultRef.current = null;
    apiCompleteRef.current = false;
    minTimeCompleteRef.current = false;
    currentTypeRef.current = ReadingType.TAROT;
    selectedCardRef.current = card;
    setLoadingType('tarot');
    setMode(AppMode.LOADING);

    // API 호출 (비동기로 진행)
    generateTarotReading(userData, card)
      .then((text) => {
        apiResultRef.current = text;
        apiCompleteRef.current = true;
        checkAndShowResult();
      })
      .catch((error) => {
        console.error('Tarot API Error:', error);
        apiResultRef.current = null;
        apiCompleteRef.current = true;
        checkAndShowResult();
      });
  };

  const handleReset = () => {
    setMode(AppMode.SELECTION);
    setResult(null);
  };

  const handleFullReset = () => {
    setMode(AppMode.INPUT);
    setResult(null);
    setUserData(INITIAL_USER_DATA);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center relative overflow-x-hidden text-slate-100">
      <StarBackground />
      
      <main className="z-10 w-full flex-grow flex flex-col items-center justify-center p-4 md:p-8 max-w-7xl mx-auto">
        {mode === AppMode.INPUT && (
          <InputForm 
            userData={userData} 
            setUserData={setUserData} 
            onSubmit={handleFormSubmit} 
          />
        )}

        {mode === AppMode.SELECTION && (
          <SelectionMenu 
            onSelect={handleSelection} 
            onBack={() => setMode(AppMode.INPUT)} 
          />
        )}

        {mode === AppMode.TAROT_DECK && (
          <TarotDeck onCardSelected={handleTarotCardSelected} />
        )}

        {/* LoadingModal은 포탈로 렌더링되므로 여기서는 빈 상태 유지 */}
        {mode === AppMode.LOADING && (
          <div className="flex flex-col items-center px-4 text-center">
            {/* LoadingModal이 오버레이로 표시됨 */}
          </div>
        )}

        {mode === AppMode.RESULT && result && (
          <ResultDisplay result={result} onReset={handleReset} />
        )}
      </main>

      <footer className="w-full text-slate-500 text-xs text-center py-4 z-10 border-t border-slate-800/50">
        <p>Cosmic Oracle &copy; {new Date().getFullYear()} | Powered by ToolB & Simulated NASA Data</p>
      </footer>

      {/* 로딩 모달 (광고 포함) */}
      <LoadingModal
        isOpen={mode === AppMode.LOADING}
        type={loadingType}
        onMinTimeComplete={handleMinTimeComplete}
      />
    </div>
  );
};

export default App;