export enum Gender {
  MALE = '남성',
  FEMALE = '여성',
  OTHER = '기타'
}

export enum CalendarType {
  SOLAR = '양력',
  LUNAR = '음력'
}

export enum AppMode {
  INPUT = 'INPUT',
  SELECTION = 'SELECTION', // Choose between Horoscope or Tarot
  TAROT_DECK = 'TAROT_DECK',
  LOADING = 'LOADING',
  RESULT = 'RESULT'
}

export enum ReadingType {
  HOROSCOPE = 'HOROSCOPE',
  TAROT = 'TAROT',
  SAJU_NEWYEAR = 'SAJU_NEWYEAR'
}

export interface UserData {
  name: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm optional
  calendarType: CalendarType;
}

export interface TarotCard {
  id: number;
  name: string;
  nameKr: string;
  meaning: string;
  imageUrl: string;
}

export interface PlanetPosition {
  name: string;      // e.g., Sun, Moon, Mercury
  sign: string;      // e.g., Aries, Taurus
  signKr: string;    // e.g., 양자리, 황소자리
  angle?: string;    // e.g., 15° 30'
  meaning: string;   // Short description of this placement
}

export interface HoroscopeData {
  planetaryPositions: PlanetPosition[];
  general: string;
  newYear: string;
  love: string;
  business: string;
  career: string;
}

// 사주 신년운세 관련 타입
export type ElementType = '목' | '화' | '토' | '금' | '수';
export type SibsinType = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '정관' | '편인' | '정인';

export interface StemInfo {
  stem: string;           // 천간 (갑, 을, 병, ...)
  element: ElementType;   // 오행
  polarity: 'yang' | 'yin'; // 음양
  image: string;          // 물상 (예: 큰 나무, 태양)
  trait: string;          // 기본 성향
}

export interface SajuNewYearData {
  userInfo: {
    ilgan: string;        // 사용자 일간
    ilganElement: ElementType;
    image: string;
  };
  yearInfo: {
    year: number;
    yearGan: string;      // 세운 천간
    yearJi: string;       // 세운 지지
    yearGanji: string;    // 세운 간지 (예: 병오)
    yearImage: string;
  };
  analysisResult: {
    relationSibsin: SibsinType;
    mainKeyword: string[];
    totalSummary: string;
    categories: {
      career: string;
      wealth: string;
      love: string;
      health: {
        status: 'Good' | 'Warning' | 'Caution';
        vulnerableOrgans: string[];
        advice: string;
      };
    };
    actionItem: string;
  };
}

export interface ReadingResult {
  text?: string; // For Tarot or fallback
  horoscopeData?: HoroscopeData; // For structured Horoscope
  sajuNewYearData?: SajuNewYearData; // For Saju New Year Fortune
  type: ReadingType;
  tarotCard?: TarotCard;
}