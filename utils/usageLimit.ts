import { UserData } from '../types';

const MAX_ATTEMPTS = 3;
const STORAGE_PREFIX = 'cosmic_oracle_usage_';

// 고유 키 생성 (이름 + 생년월일)
const getUserKey = (userData: UserData) => {
  // 공백 제거 및 소문자 처리로 일관성 유지
  const cleanName = userData.name.trim().toLowerCase();
  const cleanDate = userData.birthDate.trim();
  return `${STORAGE_PREFIX}${cleanName}_${cleanDate}`;
};

export const checkUsageLimit = (userData: UserData): boolean => {
  const key = getUserKey(userData);
  const usageStr = localStorage.getItem(key);
  const usage = usageStr ? parseInt(usageStr, 10) : 0;
  return usage < MAX_ATTEMPTS;
};

export const incrementUsage = (userData: UserData) => {
  const key = getUserKey(userData);
  const usageStr = localStorage.getItem(key);
  const usage = usageStr ? parseInt(usageStr, 10) : 0;
  localStorage.setItem(key, (usage + 1).toString());
};

export const getRemainingUsage = (userData: UserData): number => {
  const key = getUserKey(userData);
  const usageStr = localStorage.getItem(key);
  const usage = usageStr ? parseInt(usageStr, 10) : 0;
  return Math.max(0, MAX_ATTEMPTS - usage);
};

// 모든 사용자의 무료 횟수 리셋
export const resetAllUsage = () => {
  const keysToRemove = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
  keysToRemove.forEach(k => localStorage.removeItem(k));
};

// 특정 사용자의 무료 횟수 리셋
export const resetUsage = (userData: UserData) => {
  const key = getUserKey(userData);
  localStorage.removeItem(key);
};
