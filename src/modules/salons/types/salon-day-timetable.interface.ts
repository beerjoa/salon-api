import type { IDayTimetable } from '#shared/types/day-timetable.interface';

/**
 * 살롱 하루 타임테이블 정보
 * @interface ISalonDayTimetable
 * @extends IDayTimetable
 * @property {number} start_of_day - 하루 시작 시간
 * @property {number} day_modifier - 요일 식별자
 * @property {boolean} is_day_off - 영업일 여부
 * @property {ITimeSlot[]} timeslots - 타임슬롯 배열
 */
export interface ISalonDayTimetable extends IDayTimetable {}
