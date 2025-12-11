import { useState, useCallback, useRef } from 'react';

const MIN_LOADING_TIME = 15000; // 15초

interface UseLoadingWithAdResult<T> {
  isLoading: boolean;
  result: T | null;
  error: string | null;
  startLoading: (apiPromise: Promise<T>) => void;
  isMinTimeComplete: boolean;
}

export function useLoadingWithAd<T>(): UseLoadingWithAdResult<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMinTimeComplete, setIsMinTimeComplete] = useState(false);

  const apiResultRef = useRef<T | null>(null);
  const apiCompleteRef = useRef(false);
  const minTimeCompleteRef = useRef(false);

  const checkAndFinish = useCallback(() => {
    // API 완료 + 최소 시간 완료 둘 다 만족해야 종료
    if (apiCompleteRef.current && minTimeCompleteRef.current) {
      setResult(apiResultRef.current);
      setIsLoading(false);
    }
  }, []);

  const startLoading = useCallback(async (apiPromise: Promise<T>) => {
    // 상태 초기화
    setIsLoading(true);
    setResult(null);
    setError(null);
    setIsMinTimeComplete(false);
    apiResultRef.current = null;
    apiCompleteRef.current = false;
    minTimeCompleteRef.current = false;

    // 최소 대기 시간 타이머
    const minTimePromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        minTimeCompleteRef.current = true;
        setIsMinTimeComplete(true);
        resolve();
      }, MIN_LOADING_TIME);
    });

    // API 호출
    const apiHandler = apiPromise
      .then((data) => {
        apiResultRef.current = data;
        apiCompleteRef.current = true;
      })
      .catch((err) => {
        setError(err.message || '분석 중 오류가 발생했습니다.');
        apiCompleteRef.current = true;
      });

    // 둘 다 완료될 때까지 대기
    await Promise.all([minTimePromise, apiHandler]);

    // 결과 처리
    checkAndFinish();
  }, [checkAndFinish]);

  return {
    isLoading,
    result,
    error,
    startLoading,
    isMinTimeComplete,
  };
}

export default useLoadingWithAd;
