import { GoogleGenAI, Type } from "@google/genai";
import { UserData, SajuNewYearData, ElementType, SibsinType, StemInfo } from "../types";
import { parseDate } from "../utils/dateUtils";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

// 천간 데이터 (TB_STEM_CHAR)
const STEM_DATA: Record<string, StemInfo> = {
  '갑': { stem: '갑', element: '목', polarity: 'yang', image: '큰 나무, 대들보', trait: '진취적, 리더십' },
  '을': { stem: '을', element: '목', polarity: 'yin', image: '풀, 덩굴, 꽃', trait: '유연함, 적응력' },
  '병': { stem: '병', element: '화', polarity: 'yang', image: '태양, 큰 불', trait: '열정, 화려함' },
  '정': { stem: '정', element: '화', polarity: 'yin', image: '촛불, 등불', trait: '따뜻함, 섬세함' },
  '무': { stem: '무', element: '토', polarity: 'yang', image: '큰 산, 둑', trait: '중후함, 신뢰' },
  '기': { stem: '기', element: '토', polarity: 'yin', image: '논밭, 정원', trait: '포용력, 현실적' },
  '경': { stem: '경', element: '금', polarity: 'yang', image: '바위, 원석, 도끼', trait: '결단력, 의리' },
  '신': { stem: '신', element: '금', polarity: 'yin', image: '보석, 바늘', trait: '예리함, 완벽주의' },
  '임': { stem: '임', element: '수', polarity: 'yang', image: '바다, 큰 강', trait: '지혜, 포용력' },
  '계': { stem: '계', element: '수', polarity: 'yin', image: '이슬, 샘물', trait: '영리함, 감수성' },
};

// 지지 데이터
const BRANCH_DATA: Record<string, { element: ElementType; polarity: 'yang' | 'yin'; image: string }> = {
  '자': { element: '수', polarity: 'yang', image: '차가운 물, 한밤' },
  '축': { element: '토', polarity: 'yin', image: '얼어붙은 땅' },
  '인': { element: '목', polarity: 'yang', image: '새벽의 숲' },
  '묘': { element: '목', polarity: 'yin', image: '봄꽃, 새싹' },
  '진': { element: '토', polarity: 'yang', image: '습한 땅, 용' },
  '사': { element: '화', polarity: 'yin', image: '뜨거운 여름 아침' },
  '오': { element: '화', polarity: 'yang', image: '정오의 태양, 불꽃' },
  '미': { element: '토', polarity: 'yin', image: '마른 땅, 여름 오후' },
  '신': { element: '금', polarity: 'yang', image: '가을 저녁, 서늘함' },
  '유': { element: '금', polarity: 'yin', image: '보석, 황혼' },
  '술': { element: '토', polarity: 'yang', image: '마른 산, 가을 밤' },
  '해': { element: '수', polarity: 'yin', image: '깊은 밤 바다' },
};

// 천간 (10개)
const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
// 지지 (12개)
const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

// 오행 상생상극 관계
const ELEMENT_RELATIONS: Record<ElementType, { generates: ElementType; controls: ElementType; generatedBy: ElementType; controlledBy: ElementType }> = {
  '목': { generates: '화', controls: '토', generatedBy: '수', controlledBy: '금' },
  '화': { generates: '토', controls: '금', generatedBy: '목', controlledBy: '수' },
  '토': { generates: '금', controls: '수', generatedBy: '화', controlledBy: '목' },
  '금': { generates: '수', controls: '목', generatedBy: '토', controlledBy: '화' },
  '수': { generates: '목', controls: '화', generatedBy: '금', controlledBy: '토' },
};

// 오행별 취약 신체부위
const ELEMENT_HEALTH: Record<ElementType, string[]> = {
  '목': ['간', '담', '눈', '근육', '손톱'],
  '화': ['심장', '소장', '혀', '혈액순환'],
  '토': ['비장', '위장', '입술', '소화기'],
  '금': ['폐', '대장', '피부', '호흡기', '코'],
  '수': ['신장', '방광', '귀', '뼈', '생식기'],
};

// 연도에 해당하는 간지 계산
const getGanjiForYear = (year: number): { gan: string; ji: string; ganji: string } => {
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  return {
    gan: HEAVENLY_STEMS[stemIndex],
    ji: EARTHLY_BRANCHES[branchIndex],
    ganji: `${HEAVENLY_STEMS[stemIndex]}${EARTHLY_BRANCHES[branchIndex]}`
  };
};

// 일간 계산 (생년월일 기반 - 간단화된 버전)
const calculateIlgan = (birthDate: string): string => {
  // 실제로는 만세력 API를 사용해야 하지만, 여기서는 간단한 계산 사용
  const date = parseDate(birthDate);

  // 유효하지 않은 날짜 처리
  if (!date) {
    return '갑'; // 기본값 반환
  }

  const baseDate = new Date(1900, 0, 31); // 1900년 1월 31일 = 갑자일
  const diffDays = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const stemIndex = ((diffDays % 10) + 10) % 10;
  return HEAVENLY_STEMS[stemIndex];
};

// 십성 계산 (TB_SIBSIN_LOGIC)
const calculateSibsin = (ilganElement: ElementType, ilganPolarity: 'yang' | 'yin', targetElement: ElementType, targetPolarity: 'yang' | 'yin'): SibsinType => {
  const relation = ELEMENT_RELATIONS[ilganElement];
  const samePolarity = ilganPolarity === targetPolarity;

  // 비겁 (같은 오행)
  if (ilganElement === targetElement) {
    return samePolarity ? '비견' : '겁재';
  }
  // 식상 (내가 생하는 오행)
  if (relation.generates === targetElement) {
    return samePolarity ? '식신' : '상관';
  }
  // 재성 (내가 극하는 오행)
  if (relation.controls === targetElement) {
    return samePolarity ? '편재' : '정재';
  }
  // 관성 (나를 극하는 오행)
  if (relation.controlledBy === targetElement) {
    return samePolarity ? '편관' : '정관';
  }
  // 인성 (나를 생하는 오행)
  if (relation.generatedBy === targetElement) {
    return samePolarity ? '편인' : '정인';
  }

  return '비견'; // fallback
};

// 신년운세 생성
export const generateSajuNewYear = async (userData: UserData): Promise<SajuNewYearData | null> => {
  const model = "gemini-2.5-flash";

  // 다음 해 정보
  const now = new Date();
  const targetYear = now.getFullYear() + 1;
  const yearInfo = getGanjiForYear(targetYear);

  // 사용자 일간 계산
  const userIlgan = calculateIlgan(userData.birthDate);
  const userStemInfo = STEM_DATA[userIlgan] || STEM_DATA['갑'];
  const yearGanInfo = STEM_DATA[yearInfo.gan] || STEM_DATA['갑'];
  const yearJiInfo = BRANCH_DATA[yearInfo.ji] || BRANCH_DATA['자'];

  // 십성 계산 (천간 기준)
  const sibsin = calculateSibsin(
    userStemInfo.element,
    userStemInfo.polarity,
    yearGanInfo.element,
    yearGanInfo.polarity
  );

  // 건강 취약점 확인 (나를 극하는 오행이 강할 때)
  const isHealthWarning = ELEMENT_RELATIONS[userStemInfo.element].controlledBy === yearGanInfo.element;
  const vulnerableOrgans = isHealthWarning ? ELEMENT_HEALTH[userStemInfo.element] : [];

  const prompt = `
    당신은 동양 사주명리학의 대가이자, 현대적 해석에 능한 AI 운세 분석가입니다.

    [사용자 사주 정보]
    이름: ${userData.name}
    성별: ${userData.gender}
    생년월일: ${userData.birthDate}
    일간(본인의 기운): ${userIlgan} (${userStemInfo.element}/${userStemInfo.polarity === 'yang' ? '양' : '음'})
    일간 물상: ${userStemInfo.image}
    일간 기본 성향: ${userStemInfo.trait}

    [${targetYear}년 세운 정보]
    간지: ${yearInfo.ganji}년
    천간: ${yearInfo.gan} (${yearGanInfo.element}/${yearGanInfo.polarity === 'yang' ? '양' : '음'}) - ${yearGanInfo.image}
    지지: ${yearInfo.ji} (${yearJiInfo.element}) - ${yearJiInfo.image}

    [분석된 십성 관계]
    일간 vs 세운천간: ${sibsin}
    ${isHealthWarning ? `건강 주의: ${userStemInfo.element}이(가) ${yearGanInfo.element}에 극을 당함` : ''}

    [임무]
    위 정보를 바탕으로 ${targetYear}년 신년운세를 상세히 작성해주세요.

    1. 물상을 활용한 비유적 총운 요약 (예: "큰 바위인 당신이 뜨거운 태양의 해를 만났습니다")
    2. ${sibsin}의 특성을 반영한 각 영역별 운세
    3. 실질적이고 구체적인 조언

    JSON 형식으로 응답해주세요.
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
            mainKeyword: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            totalSummary: { type: Type.STRING },
            career: { type: Type.STRING },
            wealth: { type: Type.STRING },
            love: { type: Type.STRING },
            healthAdvice: { type: Type.STRING },
            actionItem: { type: Type.STRING },
          },
          required: ["mainKeyword", "totalSummary", "career", "wealth", "love", "healthAdvice", "actionItem"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response text");

    const parsed = JSON.parse(responseText);

    // 결과 데이터 구조화
    const result: SajuNewYearData = {
      userInfo: {
        ilgan: userIlgan,
        ilganElement: userStemInfo.element,
        image: userStemInfo.image,
      },
      yearInfo: {
        year: targetYear,
        yearGan: yearInfo.gan,
        yearJi: yearInfo.ji,
        yearGanji: yearInfo.ganji,
        yearImage: `${yearGanInfo.image}, ${yearJiInfo.image}`,
      },
      analysisResult: {
        relationSibsin: sibsin,
        mainKeyword: parsed.mainKeyword || [],
        totalSummary: parsed.totalSummary || '',
        categories: {
          career: parsed.career || '',
          wealth: parsed.wealth || '',
          love: parsed.love || '',
          health: {
            status: isHealthWarning ? 'Warning' : 'Good',
            vulnerableOrgans: vulnerableOrgans,
            advice: parsed.healthAdvice || '',
          },
        },
        actionItem: parsed.actionItem || '',
      },
    };

    return result;
  } catch (error) {
    console.error("Saju Analysis Error:", error);
    return null;
  }
};
