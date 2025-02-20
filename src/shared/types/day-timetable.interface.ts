import type { ITimeSlot } from '#shared/types/time-slot.interface';

/**
 * 과제 내 관련 모델에 명시된,
 * 하루 타임테이블 정보를 나타내는 인터페이스
 * 도메인 특화 확장이 필요할 경우, 추가 필드를 확장하여 사용 가능
 * @interface IDayTimetable
 * @property {number} start_of_day - 하루 시작 시간
 * @property {number} day_modifier - 요일 식별자
 * @property {boolean} is_day_off - 영업일 여부
 * @property {ITimeSlot[]} timeslots - 타임슬롯 배열
 */
export interface IDayTimetable {
  start_of_day: number;
  day_modifier: number;
  is_day_off: boolean;
  timeslots: ITimeSlot[];
}
