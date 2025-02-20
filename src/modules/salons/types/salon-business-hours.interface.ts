import type {
  IBusinessHours,
  IBusinessHoursInfo,
} from '#shared/types/business-hours.interface';

/**
 * 살롱 영업시간 정보
 * @interface ISalonBusinessHours
 * @extends IBusinessHours
 * @property {DateTime} openTime - 영업 시작 시간
 * @property {DateTime} closeTime - 영업 종료 시간
 */
export interface ISalonBusinessHours extends IBusinessHours {}

/**
 * 살롱 영업 시간과 영업일 여부 정보
 * @interface ISalonBusinessHoursInfo
 * @extends IBusinessHoursInfo
 * @property {IBusinessHours} businessHours - 영업 시간 정보
 * @property {boolean} isDayOff - 영업일 여부
 */
export interface ISalonBusinessHoursInfo extends IBusinessHoursInfo {}
