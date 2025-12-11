import React from 'react';
import { UserData, Gender, CalendarType } from '../types';
import { Sparkles, Calendar, User } from 'lucide-react';
import AdSense from './AdSense';

interface InputFormProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  onSubmit: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ userData, setUserData, onSubmit }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = userData.name && userData.birthDate;

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in flex flex-col gap-6">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl shadow-orange-900/10 p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display text-orange-400 mb-3 tracking-widest font-bold">
            COSMIC ORACLE
          </h1>
          <p className="text-slate-400 text-base md:text-lg font-light">
            별들의 이야기를 듣기 위한 첫 걸음
          </p>
        </div>
        
        <div className="space-y-6">
          {/* 이름 입력 */}
          <div className="space-y-2">
            <label className="text-slate-200 text-sm font-semibold flex items-center gap-2">
              <User size={16} className="text-orange-400" />
              이름
            </label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-lg"
              placeholder="당신의 이름을 알려주세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 성별 선택 */}
            <div className="space-y-2">
              <label className="text-slate-200 text-sm font-semibold">성별</label>
              <div className="relative">
                <select
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 appearance-none transition-all text-base"
                >
                  {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            {/* 양력/음력 선택 */}
            <div className="space-y-2">
              <label className="text-slate-200 text-sm font-semibold">양력/음력</label>
              <div className="relative">
                <select
                  name="calendarType"
                  value={userData.calendarType}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 appearance-none transition-all text-base"
                >
                  {Object.values(CalendarType).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* 생년월일 입력 */}
          <div className="space-y-2">
            <label className="text-slate-200 text-sm font-semibold flex items-center gap-2">
              <Calendar size={16} className="text-orange-400" />
              생년월일
            </label>
            <input
              type="text"
              name="birthDate"
              value={userData.birthDate}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-lg tracking-wider"
              placeholder="YYYY-MM-DD"
            />
          </div>

          <button
            onClick={onSubmit}
            disabled={!isFormValid}
            className={`w-full h-14 mt-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              isFormValid
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500 hover:to-orange-400 hover:scale-[1.02] shadow-lg shadow-orange-500/30'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles size={20} />
            <span>운명 확인하기</span>
          </button>
        </div>
      </div>

      {/* AdSense Ad - Bottom of Input Form */}
      <div className="w-full mt-4">
        <AdSense
          className="rounded-xl overflow-hidden"
          style={{ minHeight: '100px' }}
        />
      </div>
    </div>
  );
};

export default InputForm;