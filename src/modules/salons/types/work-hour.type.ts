/**
 * 요일 문자열 매핑
 */
export type TDayOfTheWeek =
  | 'sun'
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat';

/**
 * 요일 식별자 Enum
 */
export enum EDayOfTheWeekModifier {
  sun = 1,
  mon = 2,
  tue = 3,
  wed = 4,
  thu = 5,
  fri = 6,
  sat = 7,
}

/**
 * 영업시간 데이터 타입
 * @type {Object} TWorkHour
 * @property {number} close_interval - 영업시간 종료 시간 (Unix 타임스탬프)
 * @property {boolean} is_day_off - 휴무일 여부
 * @property {string} key - 요일 식별자
 * @property {number} open_interval - 영업시간 시작 시간 (Unix 타임스탬프)
 * @property {number} weekday - 요일 식별자
 */
export type TWorkHour = {
  close_interval: number;
  is_day_off: boolean;
  key: TDayOfTheWeek;
  open_interval: number;
  weekday: EDayOfTheWeekModifier;
};
