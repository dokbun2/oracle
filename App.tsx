import React, { useState } from 'react';
import { UserData, AppMode, ReadingType, ReadingResult, TarotCard } from './types';
import { INITIAL_USER_DATA } from './constants';
import { generateHoroscope, generateTarotReading } from './services/geminiService';
import { checkUsageLimit, incrementUsage, getRemainingUsage } from './utils/usageLimit';
import StarBackground from './components/StarBackground';
import InputForm from './components/InputForm';
import SelectionMenu from './components/SelectionMenu';
import TarotDeck from './components/TarotDeck';
import ResultDisplay from './components/ResultDisplay';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.INPUT);
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [result, setResult] = useState<ReadingResult | null>(null);

  const handleFormSubmit = () => {
    // 입력 단계에서 미리 횟수를 체크하여 사용자에게 알려줄 수도 있지만,
    // 구체적인 '실행' 버튼(카드 선택 등)을 누를 때 체크하는 것이 더 자연스럽습니다.
    setMode(AppMode.SELECTION);
  };

  const handleSelection = async (type: ReadingType) => {
    if (type === ReadingType.HOROSCOPE) {
      if (!checkUsageLimit(userData)) {
        alert("해당 생년월일로 무료 체험 횟수(2회)를 모두 소진하셨습니다.");
        return;
      }

      setMode(AppMode.LOADING);
      const data = await generateHoroscope(userData);
      
      if (data) {
        incrementUsage(userData); // 성공 시 횟수 차감
        setResult({ type, horoscopeData: data });
      } else {
        setResult({ type, horoscopeData: undefined, text: "운세 데이터를 불러오지 못했습니다." });
      }
      
      setMode(AppMode.RESULT);
    } else {
      // 타로는 덱 화면으로 이동 후 카드 선택 시 체크
      setMode(AppMode.TAROT_DECK);
    }
  };

  const handleTarotCardSelected = async (card: TarotCard) => {
    if (!checkUsageLimit(userData)) {
      alert("해당 생년월일로 무료 체험 횟수(2회)를 모두 소진하셨습니다.");
      setMode(AppMode.SELECTION); // 다시 선택 화면으로
      return;
    }

    setMode(AppMode.LOADING);
    const text = await generateTarotReading(userData, card);
    
    // 텍스트가 정상적으로 왔을 때만 차감
    if (text && !text.includes("오류")) {
       incrementUsage(userData);
    }

    setResult({ type: ReadingType.TAROT, text, tarotCard: card });
    setMode(AppMode.RESULT);
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

        {mode === AppMode.LOADING && (
          <div className="flex flex-col items-center animate-pulse px-4 text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(249,115,22,0.4)]"></div>
            <p className="text-2xl text-orange-400 font-display tracking-widest mb-2 font-bold">
              ORACLE READING
            </p>
            <p className="text-slate-400 text-lg">
              우주의 메시지를 수신하고 있습니다
            </p>
          </div>
        )}

        {mode === AppMode.RESULT && result && (
          <ResultDisplay result={result} onReset={handleReset} />
        )}
      </main>

      <footer className="w-full text-slate-500 text-xs text-center py-4 z-10 border-t border-slate-800/50">
        <p>Cosmic Oracle &copy; {new Date().getFullYear()} | Powered by ToolB & Simulated NASA Data</p>
      </footer>
    </div>
  );
};

export default App;