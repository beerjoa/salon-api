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
 * 과제 내 관련 모델에 명시된,
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
 * 과제 내 관련 모델에 명시된,
 * 영업시간 정보를 나타내는 인터페이스
 * 도메인 특화 확장이 필요할 경우, 추가 필드를 확장하여 사용 가능
 *
 * @interface IWorkHour
 * @property {number} weekday - 요일 식별자
 * @property {number} open_interval - 영업 시작 시간
 * @property {number} close_interval - 영업 종료 시간
 * @property {boolean} is_day_off - 영업일 여부
 */
export interface IWorkHour {
  weekday: number;
  open_interval: number;
  close_interval: number;
  is_day_off: boolean;
}
