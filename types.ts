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
  TAROT = 'TAROT'
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

export interface ReadingResult {
  text?: string; // For Tarot or fallback
  horoscopeData?: HoroscopeData; // For structured Horoscope
  type: ReadingType;
  tarotCard?: TarotCard;
}