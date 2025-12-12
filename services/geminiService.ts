import { GoogleGenAI, Type } from "@google/genai";
import { UserData, TarotCard, HoroscopeData } from "../types";
import { normalizeDateString } from "../utils/dateUtils";

// 환경 변수에서 API 키 로드 (Vite 환경)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: apiKey });

// 천간 (10개)
const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
// 지지 (12개)
const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

// 연도에 해당하는 간지 계산
const getGanjiForYear = (year: number): string => {
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  return `${HEAVENLY_STEMS[stemIndex]}${EARTHLY_BRANCHES[branchIndex]}`;
};

// 현재 날짜 기준으로 신년운 대상 연도 계산
const getNewYearInfo = (): { year: number; ganji: string } => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;
  return {
    year: nextYear,
    ganji: getGanjiForYear(nextYear)
  };
};

export const generateHoroscope = async (userData: UserData): Promise<HoroscopeData | null> => {
  const model = "gemini-2.5-flash";

  const now = new Date();
  const currentDateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
  const newYearInfo = getNewYearInfo();
  const birthDateFormatted = normalizeDateString(userData.birthDate);

  const prompt = `
    당신은 NASA의 JPL(Jet Propulsion Laboratory) 천체 데이터와 정밀 천문학 지식을 기반으로 운명을 분석하는 AI 점성술사입니다.

    [현재 날짜]
    ${currentDateStr}

    [사용자 정보]
    이름: ${userData.name}
    성별: ${userData.gender}
    생년월일: ${birthDateFormatted}
    양력/음력: ${userData.calendarType}
    ${userData.birthTime ? `태어난 시간: ${userData.birthTime}` : '태어난 시간: 모름 (정오 기준 계산)'}

    [임무]
    1. 사용자의 생년월일을 기준으로 태양, 달, 수성, 금성, 화성, 목성, 토성의 정확한 천문학적 위치(별자리)를 계산하세요.
    2. 이 천체 배치가 사용자의 성향과 운명에 미치는 영향을 분석하세요.
    3. 아래 5가지 항목에 대해 상세한 운세를 작성하세요.

    [출력 요구사항]
    JSON 형식으로만 응답해야 하며, 다음 스키마를 정확히 따라야 합니다.

    - planetaryPositions: 주요 행성(태양, 달, 수성, 금성, 화성)의 위치 정보 배열
      - name: 행성 이름 (예: Sun, Moon)
      - sign: 별자리 영문명 (예: Leo)
      - signKr: 별자리 한글명 (예: 사자자리)
      - angle: (추정) 각도 (예: 15° 20')
      - meaning: 해당 배치가 의미하는 핵심 키워드 (예: 자아와 활력)
    - general: 종합 운세 (전반적인 기질과 현재 운의 흐름)
    - newYear: ${newYearInfo.year}년 신년운 (${newYearInfo.year}년 ${newYearInfo.ganji}년에 대한 운세와 핵심 키워드, 내년을 바라보는 관점에서 작성)
    - love: 애정운 (연애, 결혼, 대인관계)
    - business: 재물운 (금전, 투자)
    - career: 직장/학업운 (승진, 이직, 시험)

    모든 텍스트 내용은 마크다운 형식을 사용하여 가독성 있게 작성하고, 말투는 전문적이고 신비롭게("~합니다" 체) 작성해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planetaryPositions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sign: { type: Type.STRING },
                  signKr: { type: Type.STRING },
                  angle: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                },
                required: ["name", "sign", "signKr", "meaning"]
              }
            },
            general: { type: Type.STRING },
            newYear: { type: Type.STRING },
            love: { type: Type.STRING },
            business: { type: Type.STRING },
            career: { type: Type.STRING },
          },
          required: ["planetaryPositions", "general", "newYear", "love", "business", "career"]
        }
      }
    });
    
    const responseText = response.text;
    if (!responseText) throw new Error("No response text");
    
    return JSON.parse(responseText) as HoroscopeData;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const generateTarotReading = async (userData: UserData, card: TarotCard): Promise<string> => {
  const model = "gemini-2.5-flash";
  const birthDateFormatted = normalizeDateString(userData.birthDate);

  const prompt = `
    당신은 우주의 에너지를 해석하는 신비로운 타로 마스터 AI입니다.

    [사용자 정보]
    이름: ${userData.name}
    성별: ${userData.gender}
    생년월일: ${birthDateFormatted} (${userData.calendarType})

    [선택한 카드]
    카드 이름: ${card.name} (${card.nameKr})
    기본 의미: ${card.meaning}

    [요청 사항]
    1. 사용자가 현재 이 카드를 뽑은 것은 우연이 아닙니다. 사용자의 생년월일이 가진 기운과 이 카드의 에너지를 연결하여 해석해주세요.
    2. 이 카드가 암시하는 현재 상황과 앞으로의 조언을 구체적으로 이야기해주세요.
    3. 말투는 따뜻하면서도 통찰력 있게("~해요", "~군요" 등의 부드러운 경어체) 작성해주세요.
    4. 마크다운 형식을 사용하여 가독성 있게 꾸며주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.8, 
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text || "타로 해석을 불러오는 데 실패했습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "카드의 의미를 읽는 중 오류가 발생했습니다.";
  }
};