// 날짜 문자열 정규화 (다양한 형식 지원)
export const normalizeDateString = (dateStr: string): string => {
  // 공백 제거
  const trimmed = dateStr.trim();

  // YYYYMMDD 형식 (8자리 숫자만)
  if (/^\d{8}$/.test(trimmed)) {
    const year = trimmed.substring(0, 4);
    const month = trimmed.substring(4, 6);
    const day = trimmed.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  // 점(.)이나 슬래시(/)를 하이픈(-)으로 변환
  return trimmed.replace(/[./]/g, '-');
};

// 날짜 문자열을 Date 객체로 변환
export const parseDate = (dateStr: string): Date | null => {
  const normalized = normalizeDateString(dateStr);
  const date = new Date(normalized);

  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', dateStr, '-> normalized:', normalized);
    return null;
  }

  return date;
};
