import { TarotCard, Gender, CalendarType } from './types';

export const MAJOR_ARCANA: TarotCard[] = [
  { id: 0, name: "The Fool", nameKr: "광대", meaning: "새로운 시작, 순수함, 모험", imageUrl: "https://picsum.photos/id/10/300/450" },
  { id: 1, name: "The Magician", nameKr: "마법사", meaning: "창조력, 기술, 의지", imageUrl: "https://picsum.photos/id/20/300/450" },
  { id: 2, name: "The High Priestess", nameKr: "여사제", meaning: "직관, 신비, 지혜", imageUrl: "https://picsum.photos/id/30/300/450" },
  { id: 3, name: "The Empress", nameKr: "여황제", meaning: "풍요, 모성, 자연", imageUrl: "https://picsum.photos/id/40/300/450" },
  { id: 4, name: "The Emperor", nameKr: "황제", meaning: "권위, 구조, 통제", imageUrl: "https://picsum.photos/id/50/300/450" },
  { id: 5, name: "The Hierophant", nameKr: "교황", meaning: "전통, 신념, 가르침", imageUrl: "https://picsum.photos/id/60/300/450" },
  { id: 6, name: "The Lovers", nameKr: "연인", meaning: "사랑, 조화, 선택", imageUrl: "https://picsum.photos/id/70/300/450" },
  { id: 7, name: "The Chariot", nameKr: "전차", meaning: "승리, 의지, 행동", imageUrl: "https://picsum.photos/id/80/300/450" },
  { id: 8, name: "Strength", nameKr: "힘", meaning: "용기, 인내, 동정심", imageUrl: "https://picsum.photos/id/90/300/450" },
  { id: 9, name: "The Hermit", nameKr: "은둔자", meaning: "성찰, 고독, 인도", imageUrl: "https://picsum.photos/id/100/300/450" },
  { id: 10, name: "Wheel of Fortune", nameKr: "운명의 수레바퀴", meaning: "변화, 주기, 운명", imageUrl: "https://picsum.photos/id/110/300/450" },
  { id: 11, name: "Justice", nameKr: "정의", meaning: "공정함, 진실, 법", imageUrl: "https://picsum.photos/id/120/300/450" },
  { id: 12, name: "The Hanged Man", nameKr: "매달린 사람", meaning: "희생, 새로운 관점, 정지", imageUrl: "https://picsum.photos/id/130/300/450" },
  { id: 13, name: "Death", nameKr: "죽음", meaning: "종결, 변형, 새로운 시작", imageUrl: "https://picsum.photos/id/140/300/450" },
  { id: 14, name: "Temperance", nameKr: "절제", meaning: "균형, 중용, 목적", imageUrl: "https://picsum.photos/id/150/300/450" },
  { id: 15, name: "The Devil", nameKr: "악마", meaning: "속박, 중독, 물질주의", imageUrl: "https://picsum.photos/id/160/300/450" },
  { id: 16, name: "The Tower", nameKr: "탑", meaning: "갑작스러운 변화, 붕괴, 계시", imageUrl: "https://picsum.photos/id/170/300/450" },
  { id: 17, name: "The Star", nameKr: "별", meaning: "희망, 영감, 평온", imageUrl: "https://picsum.photos/id/180/300/450" },
  { id: 18, name: "The Moon", nameKr: "달", meaning: "환상, 두려움, 무의식", imageUrl: "https://picsum.photos/id/190/300/450" },
  { id: 19, name: "The Sun", nameKr: "태양", meaning: "성공, 활력, 기쁨", imageUrl: "https://picsum.photos/id/200/300/450" },
  { id: 20, name: "Judgement", nameKr: "심판", meaning: "부활, 소명, 내면의 깨달음", imageUrl: "https://picsum.photos/id/210/300/450" },
  { id: 21, name: "The World", nameKr: "세계", meaning: "완성, 통합, 성취", imageUrl: "https://picsum.photos/id/220/300/450" },
];

export const INITIAL_USER_DATA = {
  name: '',
  gender: Gender.MALE,
  birthDate: '',
  calendarType: CalendarType.SOLAR
};