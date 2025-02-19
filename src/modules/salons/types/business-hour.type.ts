import { DateTime } from 'luxon';

/**
 * 영업시간 시작/종료 시간 타입
 * @type {Object} TBusinessHours
 * @property {DateTime} openTime - 영업시간 시작 시간
 * @property {DateTime} closeTime - 영업시간 종료 시간
 */
export type TBusinessHours = {
  openTime: DateTime;
  closeTime: DateTime;
};

/**
 * 비즈니스 시간 정보 타입 - 영업시간과 휴무 여부 포함
 * @type {Object} TBusinessHoursInfo
 * @property {TBusinessHours} businessHours - 영업시간 정보
 * @property {boolean} isDayOff - 휴무 여부
 */
export type TBusinessHoursInfo = {
  businessHours: TBusinessHours;
  isDayOff: boolean;
};
