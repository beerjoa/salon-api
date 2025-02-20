import { DateTime } from 'luxon';

/**
 * 영업시간 정보를 나타내는 인터페이스
 * 도메인 특화 확장이 필요할 경우, 추가 필드를 확장하여 사용 가능
 * @interface IBusinessHours
 * @property {DateTime} openTime - 영업 시작 시간
 * @property {DateTime} closeTime - 영업 종료 시간
 */
export interface IBusinessHours {
  openTime: DateTime;
  closeTime: DateTime;
}

/**
 * 영업 시간과 영업일 여부를 나타내는 인터페이스
 * 도메인 특화 확장이 필요할 경우, 추가 필드를 확장하여 사용 가능
 * @interface IBusinessHoursInfo
 * @property {IBusinessHours} businessHours - 영업 시간 정보
 * @property {boolean} isDayOff - 영업일 여부
 */
export interface IBusinessHoursInfo {
  businessHours: IBusinessHours;
  isDayOff: boolean;
}
